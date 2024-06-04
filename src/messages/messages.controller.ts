import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UsersService } from 'src/users/users.service';

@Controller('api')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sendMessage')
  async sendMessage(@Body() data: any, @Req() req: any) {
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
    if (data.sender.toLowerCase() === data.received.toLowerCase()) {
      return new HttpException(
        'You cannot send a message to yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const message = await this.messagesService.sendMessage(
      data,
      decodeToken.id,
    );
    if (!message) {
      return new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }
    return {
      status: 'success',
      message: message,
    };
  }

  @Get('viewMessages')
  async viewMessages(@Req() req: any) {
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
    const messages = await this.messagesService.viewAllMessages(decodeToken.id);
    return messages;
  }

  @Get('viewMessages/:username')
  async viewMessagesByUsername(
    @Param('username') username: string,
    @Req() req: any,
  ) {
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
    const getMessageByUsername =
      await this.messagesService.viewMessageByUsername(
        decodeToken.id,
        username.toLowerCase(),
      );

    return getMessageByUsername;
  }

  @Delete('deleteMessage/:id')
  async deleteMessage(@Param('id') id: string, @Req() req: any) {
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
    const message = await this.messagesService.viewOneMessage(
      decodeToken.id,
      id,
    );
    if (!message) {
      return new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    const deleteMessage = await this.messagesService.deleteMessageById(id);
    if (deleteMessage) {
      return new HttpException('Message has been deleted', HttpStatus.OK);
    }
  }
}
