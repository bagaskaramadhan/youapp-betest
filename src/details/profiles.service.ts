import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profiles } from './profiles.model';
import { Users } from 'src/users/users.model';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('cProfiles') private profilesModel: Model<Profiles>,
    @InjectModel('cUsers') private usersModel: Model<Users>,
  ) {}

  async createProfile(data: any, idUser: any) {
    const saveProfile = await new this.profilesModel(data);
    const getUserId = await this.usersModel.findById(idUser);
    getUserId.profile = saveProfile.id;
    await saveProfile.save();
    await getUserId.save();
    return saveProfile;
  }

  async checkProfile(id: string) {
    const getUserId = await this.usersModel.findById(id);
    return getUserId;
  }

  async updateProfile(data: any) {
    console.log(data);
    const checkIdProfileUser = await this.usersModel.findById(data.user);
    const checkIdProfile = await this.profilesModel.findById(
      checkIdProfileUser.profile,
    );
    const updateData = {
      display_name: !data.display_name
        ? checkIdProfile.display_name
        : data.display_name,
      gender: !data.gender ? checkIdProfile.gender : data.gender,
      birthday: !data.birthday ? checkIdProfile.birthday : data.birthday,
      profile_picture: !data.profile_picture
        ? checkIdProfile.profile_picture
        : data.profile_picture,
      horoscope: !data.horoscope ? checkIdProfile.horoscope : data.horoscope,
      zodiac: !data.zodiac ? checkIdProfile.zodiac : data.zodiac,
      height: !data.height ? checkIdProfile.height : data.height,
      weight: !data.weight ? checkIdProfile.weight : data.weight,
      interest: !data.interest ? checkIdProfile.interest : data.interest,
    };
    const updateProfile = await this.profilesModel.findByIdAndUpdate(
      checkIdProfileUser.profile,
      updateData,
    );
    return updateProfile;
  }
}
