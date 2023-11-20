import express from 'express';
import contactsController from '../../controllers/contacts-controller.js';
import { isEmptyBody, isValidateId } from '../../middlewares/index.js';
import { validateBodyWrapper } from '../../decorators/index.js';
import {
  contactAddSchema,
  contactFavoriteSchema,
  contactUpdateSchema,
} from '../../models/Contact.js';
const contactRouter = express.Router();

contactRouter.get('/', contactsController.getAll);

contactRouter.get('/:id', isValidateId, contactsController.getById);

contactRouter.post(
  '/',
  isEmptyBody,
  validateBodyWrapper(contactAddSchema),
  contactsController.add
);

contactRouter.put(
  '/:id',
  isValidateId,
  isEmptyBody,
  validateBodyWrapper(contactUpdateSchema),
  contactsController.updateById
);

contactRouter.patch(
  '/:id/favorite',
  isValidateId,
  // isEmptyBody,
  validateBodyWrapper(contactFavoriteSchema),
  contactsController.updateById
);
contactRouter.delete('/:id', isValidateId, contactsController.deleteById);

export default contactRouter;
