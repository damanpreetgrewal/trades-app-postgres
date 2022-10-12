import express, { Router } from 'express';
import { check } from 'express-validator';

import { getTradesSummary } from '../controllers/queryController';
import { poolDB } from '../db/connection';

const router: Router = express.Router();

router.route('/').post(
  [
    check('userId')
      .custom(async (value, { req }) => {
        return await poolDB
          .query('SELECT * FROM Users WHERE id = $1', [value])
          .then(userData => {
            if (userData.rows.length === 0) {
              return Promise.reject(`User with id : ${value} doesnt exist`);
            }
          });
      })
      .optional(),
    check('executionType')
      .isIn(['buy', 'sell'])
      .withMessage('Execution Type must be either buy or sell (case sensitive)')
      .optional(),
    check('executionStartDate')
      .isISO8601()
      .toDate()
      .withMessage('ExecutionStartDate must be of format: YYYY-MM-DD HH:MM:SS')
      .optional(),
    check('executionEndDate')
      .isISO8601()
      .toDate()
      .withMessage('ExecutionEndDate must be of format: YYYY-MM-DD HH:MM:SS')
      .optional(),
  ],
  getTradesSummary
);

export default router;
