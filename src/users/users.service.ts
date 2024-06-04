import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';

config();
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('cUsers') private readonly usersModel: Model<Users>, // @InjectModel('cProfiles') private readonly profilesModel: Model<Profiles>, // private readonly profilesService: ProfilesService,
  ) {}

  async generateToken(payload: any) {
    try {
      const dataPayload = { username: payload.username, id: payload.id };
      const token = await jwt.sign(dataPayload, process.env.TOKEN_KEY, {
        expiresIn: '3m',
      });
      return token;
    } catch (err) {
      console.log(err);
    }
  }

  async verifyToken(token: string) {
    try {
      const result: any = await jwt.verify(token, process.env.TOKEN_KEY);
      return result;
    } catch (err) {
      return err.message;
    }
  }

  async decodeToken(token: string) {
    try {
      const tokenDetails = await jwt.decode(token);
      let dataToken: string | undefined | any;
      if (typeof tokenDetails === 'string') {
        const decodedToken = jwt.decode(tokenDetails);
        if (decodedToken && typeof decodedToken === 'object') {
          dataToken = {
            username: decodedToken.username,
            id: decodedToken.id,
          };
        }
      } else {
        dataToken = { username: tokenDetails.username, id: tokenDetails.id };
      }
      return dataToken;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

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
      const userData = new this.usersModel({
        ...data,
        password: hashedPassword,
        profile: null,
      });
      await userData.save();
      return;
    } catch (err) {
      console.log('Error @Injectable.register', err);
    }
  }

  async login(data: any, password: string) {
    try {
      const isPasswordMatching = await bcrypt.compare(data.password, password);
      if (!isPasswordMatching) {
        return isPasswordMatching;
      }
      const getUser = await this.checkUser(data);
      return getUser;
    } catch (err) {
      console.log('Error @Injectable.login', err);
    }
  }

  async getUsername(username: string) {
    try {
      const getUsername = await this.usersModel
        .findOne({ username })
        .populate({
          path: 'profile',
          select: '-__v',
        })
        .select('-__v')
        .exec();
      return getUsername;
    } catch (err) {
      console.log('Error @Injectable.checkUserId', err);
    }
  }
}
