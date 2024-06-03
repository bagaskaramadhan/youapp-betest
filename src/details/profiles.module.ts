import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ProfilesSchema } from './profiles.model';
import { UsersService } from 'src/users/users.service';
import { UsersSchema } from 'src/users/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'cProfiles',
        schema: ProfilesSchema,
      },
      {
        name: 'cUsers',
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, UsersService],
})
export class ProfilesModule {}
