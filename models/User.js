import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, preUpdate } from './hooks.js';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const userSchema = new Schema(
  {
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, 'Set email for user'],
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, 'Set password for user'],
    },
    token: {
      type: String,
    },
  },
  { versionKey: false }
);

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', preUpdate);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const User = model('user', userSchema);

export default User;
