import mongoose from 'mongoose';

export const ProfilesSchema = new mongoose.Schema({
  display_name: { type: String },
  gender: { type: String },
  birthday: { type: Date },
  profile_picture: { type: String },
  horoscope: { type: String },
  zodiac: { type: String },
  height: { type: Number },
  weight: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  interest: { type: [String] },
});

export class Profiles {
  constructor(
    public display_name: string,
    public gender: string,
    public birthday: Date,
    public profile_picture: string,
    public horoscope: string,
    public zodiac: string,
    public height: number,
    public weight: number,
    public interest: string[],
  ) {}
}
