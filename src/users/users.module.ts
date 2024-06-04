import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersSchema } from './users.model';
import { MessagesSchema } from 'src/messages/messages.model';
import { MessagesService } from 'src/messages/messages.service';
import { MessagesController } from 'src/messages/messages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'cUsers', schema: UsersSchema },
      { name: 'cMessages', schema: MessagesSchema },
    ]),
  ],
  controllers: [UsersController, MessagesController],
  providers: [UsersService, MessagesService],
})
export class UsersModule {}
