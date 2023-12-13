import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import { ctrlContactWrapper } from '../decorators/index.js';
import fs from 'fs/promises';
import path from 'path';

const avatarsPath = path.resolve('public', 'avatars');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'email subscription');
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id = ${id} not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const avatar = path.join('avatars', filename);
  const result = await Contact.create({ ...req.body, avatar, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id = ${id} not found`);
  }
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id = ${id} not found`);
  }
  res.json({ message: 'contact deleted' });
};
export default {
  getAll: ctrlContactWrapper(getAll),
  getById: ctrlContactWrapper(getById),
  add: ctrlContactWrapper(add),
  updateById: ctrlContactWrapper(updateById),
  deleteById: ctrlContactWrapper(deleteById),
};
