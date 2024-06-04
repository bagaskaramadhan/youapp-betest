import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { config } from 'dotenv';
import { ProfilesModule } from './profiles/profiles.module';
import { MessagesModule } from './messages/messages.module';

config();
const url = process.env.MONGO_URL;
@Module({
  imports: [
    MongooseModule.forRoot(url),
    UsersModule,
    ProfilesModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
