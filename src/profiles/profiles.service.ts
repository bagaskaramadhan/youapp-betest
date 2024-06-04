import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profiles } from './profiles.model';
import { Users } from 'src/users/users.model';
import * as dayjs from 'dayjs';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('cProfiles') private profilesModel: Model<Profiles>,
    @InjectModel('cUsers') private usersModel: Model<Users>,
  ) {}

  async zodiacAndHoroscope(data: any) {
    const year = dayjs(data.birthday).year();
    const month = dayjs(data.birthday).month() + 1;
    const day = dayjs(data.birthday).date();
    // zodiac
    const startYear = 1900;
    const shioArr = [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Goat',
      'Monkey',
      'Rooster',
      'Dog',
      'Pig',
    ];
    const yearDifference = year - startYear;
    const shio = (yearDifference + 12) % 12;
    const shioResult = shioArr[shio];
    let horoscope;
    // horoscope
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      horoscope = 'Aquarius';
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      horoscope = 'Pisces';
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      horoscope = 'Aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      horoscope = 'Taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
      horoscope = 'Gemini';
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
      horoscope = 'Cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      horoscope = 'Leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      horoscope = 'Virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
      horoscope = 'Libra';
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
      horoscope = 'Scorpius';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      horoscope = 'Sagittarius';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      horoscope = 'Capricornus';
    }

    const result = {
      zodiac: shioResult,
      horoscope,
    };
    return result;
  }

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
    const getProfileId = await this.profilesModel.findById(getUserId.profile);
    return getProfileId;
  }

  async updateProfile(data: any) {
    const checkIdProfileUser = await this.usersModel.findById(data.user);
    const checkIdProfile = await this.profilesModel.findById(
      checkIdProfileUser.profile,
    );
    const updateData = {
      display_name: !data.display_name
        ? checkIdProfile.display_name
        : data.display_name,
      gender: !data.gender ? checkIdProfile.gender : data.gender,
      profile_picture: !data.profile_picture
        ? checkIdProfile.profile_picture
        : data.profile_picture,
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
