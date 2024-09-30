import { isValidObjectId, Model, SortOrder } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { hashPassword } from '@/helpers/hashPassword';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    const { password, ...newUser } = user;
    return newUser;
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
