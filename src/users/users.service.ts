import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {}

  async checkUser(data: any) {
    try {
      const result = await this.usersModel.findOne({
        $or: [{ username: data.username }, { email: data.email }],
      });
      return result;
    } catch (err) {
      console.log('Error @Injectable.checkUser', err);
    }
  }

  async register(data: any) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = new this.usersModel({
        ...data,
        password: hashedPassword,
      });
      const result = await newUser.save();
      return result;
    } catch (err) {
      console.log('Error @Injectable.register', err);
    }
  }

  async login(data: any, password: string) {
    try {
      const isPasswordMatching = await bcrypt.compare(data.password, password);
      return isPasswordMatching;
    } catch (err) {
      console.log('Error @Injectable.login', err);
    }
  }
}
