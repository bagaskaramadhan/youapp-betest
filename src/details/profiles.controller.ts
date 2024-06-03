import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UsersService } from 'src/users/users.service';
import * as dayjs from 'dayjs';

@Controller('api')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('createProfile')
  async createProfile(@Body() body: any, @Req() req: any) {
    // gentoken
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
    }
    const verifyToken = await this.usersService.verifyToken(token);
    if (verifyToken === 'invalid signature') {
      return new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    } else if (verifyToken === 'jwt expired') {
      return new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
    }
    const decodeToken = await this.usersService.decodeToken(token);
    // gentoken
    if (!body.name || !body.birthday || !body.gender) {
      return new HttpException('Cannot be empty', HttpStatus.BAD_REQUEST);
    }
    const checkUserProfile = await this.profilesService.checkProfile(
      decodeToken.id,
    );
    if (checkUserProfile.profile !== null) {
      return new HttpException(
        'Profile cannot be created twice.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const birthdayFormat = 'YYYY-MM-DD';
    const isValidBirthday = dayjs(
      body.birthday,
      birthdayFormat,
      true,
    ).isValid();

    if (!isValidBirthday) {
      return new HttpException(
        'Invalid birthday format e.g: YYYY-MM-DD',
        HttpStatus.BAD_REQUEST,
      );
    }
    body.birthday = dayjs(body.birthday).format('YYYY-MM-DD 00:00:00');
    const bodyData = {
      display_name: body.name,
      gender: body.gender,
      birthday: body.birthday,
      profile_picture: !body.profile_picture ? '' : body.profile_picture,
      horoscope: body.horoscope,
      zodiac: body.zodiac,
      height: body.height,
      weight: body.weight,
      user: decodeToken.id,
      interest: !body.interest ? [''] : body.interest,
    };
    const createProfile = await this.profilesService.createProfile(
      bodyData,
      bodyData.user,
    );
    if (createProfile) {
      return new HttpException('Profile has been created', HttpStatus.CREATED);
    }
  }

  @Patch('updateProfile')
  async updateProfile(@Body() body: any, @Req() req: any) {
    // gentoken
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
    }
    const verifyToken = await this.usersService.verifyToken(token);
    if (verifyToken === 'invalid signature') {
      return new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    } else if (verifyToken === 'jwt expired') {
      return new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
    }
    const decodeToken = await this.usersService.decodeToken(token);
    // gentoken

    if (!Array.isArray(body.interest)) {
      return new HttpException(
        'Interest must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }

    const birthdayFormat = 'YYYY-MM-DD';
    const isValidBirthday = dayjs(
      body.birthday,
      birthdayFormat,
      true,
    ).isValid();

    if (!isValidBirthday) {
      return new HttpException(
        'Invalid birthday format e.g: YYYY-MM-DD',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bodyData = {
      display_name: body.name,
      gender: body.gender,
      birthday: body.birthday,
      profile_picture: !body.profile_picture ? '' : body.profile_picture,
      horoscope: body.horoscope,
      zodiac: body.zodiac,
      height: body.height,
      weight: body.weight,
      user: decodeToken.id,
      interest: !body.interest ? [''] : body.interest,
    };
    await this.profilesService.updateProfile(bodyData);
    return new HttpException('Profile has been updated', HttpStatus.CREATED);
  }
}
