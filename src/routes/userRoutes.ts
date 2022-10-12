import express, { Router } from 'express';
import { body } from 'express-validator';

import { getUsers, postUser } from '../controllers/usersController';

const router: Router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(
    [body('name').not().isEmpty().trim().withMessage('Name is required')],
    postUser
  );

export default router;
