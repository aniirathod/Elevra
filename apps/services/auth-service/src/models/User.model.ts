import { Schema, model, Document } from 'mongoose';

// The TypeScript interface for a User document
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  refreshToken?: string; // Optional field for storing the refresh token
}

// The Mongoose Schema
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    index: true, 
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true, 
});


const User = model<IUser>('User', UserSchema);
export default User;