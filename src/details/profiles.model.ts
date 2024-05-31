import mongoose from 'mongoose';

export const ProfilesSchema = new mongoose.Schema({
  full_name: { type: String },
  bio: { type: String },
  location: { type: String },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export class Profiles {
  constructor(
    public full_name: string,
    public bio: string,
    public location: string,
    public profile_picture: string,
  ) {}
}
