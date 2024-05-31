import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { config } from 'dotenv';

config();

@Controller(`${process.env.PREFIX}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      if (!username || !email || !password) {
        return new HttpException('Cannot be empty', HttpStatus.BAD_REQUEST);
      }

      const passwordLength = 6;
      if (password.length < passwordLength) {
        return new HttpException(
          `Password at least ${passwordLength} characters`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const body = {
        username: username?.toLowerCase(),
        email: email?.toLowerCase(),
        password,
      };
      const checkUser = await this.usersService.checkUser(body);
      if (!checkUser) {
        await this.usersService.register(body);
        return new HttpException('User Created', HttpStatus.CREATED);
      }
      return new HttpException(
        'Email/Username has been used',
        HttpStatus.CONFLICT,
      );
    } catch (err) {
      console.log('Error @Controller.register', err);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      if (!username || !email || !password) {
        return new HttpException('Cannot be empty', HttpStatus.BAD_REQUEST);
      }

      const body = {
        username: username?.toLowerCase(),
        email: email?.toLowerCase(),
        password,
      };
      const checkUser = await this.usersService.checkUser(body);
      if (!checkUser) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const result = await this.usersService.login(body, checkUser.password);
      if (!result) {
        return new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
      }
      return new HttpException('Success', HttpStatus.OK);
    } catch (err) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
