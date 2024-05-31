import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profiles } from './profiles.model';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('cProfiles') private profilesModel: Model<Profiles>,
  ) {}

  async createProfile(data: any) {
    const bodyData = {
      user_id: data.id,
      full_name: '',
      bio: '',
      location: '',
      profile_picture: '',
    };

    const newProfile = await new this.profilesModel(bodyData);
    await newProfile.save();
  }

  // async getProfileByUserId(id: string) {
  //   return await this.profilesModel.findOne({
  //     user_id: id,
  //   });
  // }
}
