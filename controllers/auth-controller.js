import User from '../models/User.js';
import { ctrlContactWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      subscription: newUser.subscription,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };

  const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '23h' });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json();
};

export default {
  register: ctrlContactWrapper(register),
  login: ctrlContactWrapper(login),
  current: ctrlContactWrapper(current),
  logout: ctrlContactWrapper(logout),
};
