import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { config } from 'dotenv';

config();

@Controller('api')
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
      const access_token = await this.usersService.generateToken(checkUser);
      return {
        status: HttpStatus.OK,
        access_token,
      };
    } catch (err) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getProfile')
  async getProfile(@Req() req: any) {
    try {
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
      // gentoken
      // token username and compare users username
      const decodeToken = await this.usersService.decodeToken(token);
      const getUsername = await this.usersService.getUsername(
        decodeToken.username,
      );
      if (!getUsername) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (getUsername.username !== decodeToken.username) {
        return new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      // token username and compare users username
      return getUsername;
    } catch (err) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getProfile/:username')
  async getUsername(@Param('username') username: string, @Req() req: any) {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
      }
      const getUsername = await this.usersService.getUsername(username);
      if (!getUsername) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return getUsername;
    } catch (err) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
