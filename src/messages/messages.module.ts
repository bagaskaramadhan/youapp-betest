import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesSchema } from './messages.model';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { UsersSchema } from 'src/users/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'cMessages', schema: MessagesSchema },
      {
        name: 'cUsers',
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [MessagesController, UsersController],
  providers: [MessagesService, UsersService],
})
export class MessagesModule {}
