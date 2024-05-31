import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ProfilesService } from 'src/details/profiles.service';
import { Profiles } from 'src/details/profiles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('cUsers') private readonly usersModel: Model<Users>,
    @InjectModel('cProfiles') private readonly profilesModel: Model<Profiles>,
    private readonly profilesService: ProfilesService,
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
      const userData = new this.usersModel({
        ...data,
        password: hashedPassword,
      });
      const saveUserData = await userData.save();

      const profileUser = new this.profilesModel({
        full_name: '',
        bio: '',
        location: '',
        profile_picture: '',
        user: saveUserData.id,
      });
      const saveProfileUser = await profileUser.save();

      saveUserData.profile = saveProfileUser.id;
      await saveUserData.save();
      return;
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
