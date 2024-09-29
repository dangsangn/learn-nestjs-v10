import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserPayload } from './payload/user.payload';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserPayload> {
    const createUser = new this.userModel(createUserDto);
    const user = await createUser.save();
    return user;
  }

  async findAll(): Promise<UserPayload[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<UserPayload> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User with email id: ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserPayload> {
    await this.userModel.updateOne({ _id: id }, updateUserDto);
    const updatedUser = await this.userModel.findById(id);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
