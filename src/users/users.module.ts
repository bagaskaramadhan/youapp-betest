import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './users.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profiles, ProfilesSchema } from 'src/details/profiles.model';
import { ProfilesService } from 'src/details/profiles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'cUsers', schema: UsersSchema },
      {
        name: 'cProfiles',
        schema: ProfilesSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ProfilesService],
})
export class UsersModule {}
