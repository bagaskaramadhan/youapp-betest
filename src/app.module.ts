import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { config } from 'dotenv';

config();
const url = process.env.MONGO_URL;
@Module({
  imports: [UsersModule, MongooseModule.forRoot(url)],
  controllers: [],
  providers: [],
})
export class AppModule {}
