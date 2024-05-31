import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export class Users {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password: string,
  ) {}
}
