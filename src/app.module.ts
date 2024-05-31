import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { config } from 'dotenv';
import { ProfilesModule } from './details/profiles.module';

config();
const url = process.env.MONGO_URL;
@Module({
  imports: [MongooseModule.forRoot(url), UsersModule, ProfilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
