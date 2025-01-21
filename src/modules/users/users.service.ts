import { isValidObjectId, Model, SortOrder } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { hashPassword } from '@/helpers/hashPassword';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  async existEmail(email: string) {
    const user = await this.userModel.exists({ email });
    return !!user;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const existUser = await this.existEmail(email);
    if (existUser)
      throw new BadRequestException(`User ${email} already exists.`);

    const hashPass = await hashPassword(password);
    const newUser = await this.userModel.create({
      email,
      name,
      password: hashPass,
    });

    return { _id: newUser._id };
  }

  async registerUser(createRegisterDto: CreateAuthDto) {
    const { email, password, name } = createRegisterDto;
    const existUser = await this.existEmail(email);
    if (existUser)
      throw new BadRequestException(`User ${email} already exists.`);

    const hashPass = await hashPassword(password);
    const activationCode = uuidv4();
    const codeMinutes = 1;
    const newUser = await this.userModel.create({
      email,
      name,
      password: hashPass,
      isActive: false,
      codeExpired: dayjs().add(codeMinutes, 'minutes'),
      codeId: activationCode,
    });
    try {
      this.mailerService.sendMail({
        to: email,
        subject: 'NestJS Test Send Mail',
        text: 'welcome',
        template: './register',
        context: {
          name: name ?? email,
          activationCode,
          codeMinutes,
        },
      });
    } catch (error) {
      console.log('error:', error);
    }

    return { _id: newUser._id };
  }

  async findAll(query: string, current: number) {
    const { filter, sort } = aqp(query);
    let { limit } = aqp(query);
    if (!current) current = 1;
    if (!limit) limit = 10;
    const total = (await this.userModel.find(filter)).length;
    const pages = Math.ceil(total / limit);
    const skip = (current - 1) * limit;

    const result = await this.userModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .select('-password')
      .sort(sort as Record<string, SortOrder>);

    return {
      data: result,
      pagination: {
        current,
        limit,
        pages,
        total,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new BadRequestException(`User not found`);
    }
    const { password, ...restUser } = user.toObject();
    return restUser;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException(`User not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    if (isValidObjectId(id)) {
      return this.userModel.deleteOne({ _id: id });
    }

    throw new BadRequestException(`User not found`);
  }
}
