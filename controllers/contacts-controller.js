import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import { ctrlContactWrapper } from '../decorators/index.js';

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filterQueryParams } = req.query;
  const skip = (page - 1) * limit;
  const count = await Contact.countDocuments({ owner });
  const filterQuery = { owner, ...filterQueryParams };

  const result = await Contact.find(filterQuery, {
    skip,
    limit,
  }).populate('owner', 'email subscription');
  res.json({
    result,
    total: count,
    per_page: limit,
  });
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
  const result = await Contact.create(req.body);
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
