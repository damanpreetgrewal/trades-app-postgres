import express, { Router } from 'express';
import { body, check } from 'express-validator';

import { getUsers, postUser } from '../controllers/usersController';
import { poolDB } from '../db/connection';

const router: Router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(
    [body('name').not().isEmpty().trim().withMessage('Name is required')],
    postUser
  );

export default router;
