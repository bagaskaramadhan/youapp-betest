import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profiles, ProfilesSchema } from './profiles.model';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'cProfiles',
        schema: ProfilesSchema,
      },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
