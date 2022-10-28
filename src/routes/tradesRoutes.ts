import express, { Router } from 'express';
import { body, check } from 'express-validator';

import {
  getTrades,
  getSingleTrade,
  postTrade,
  updateTrade,
  deleteTrade,
} from '../controllers/tradesController';
import { poolDB } from '../db/connection';

const router: Router = express.Router();

router
  .route('/')
  .get(getTrades)
  .post(
    [
      body('ticker')
        .not()
        .isEmpty()
        .trim()
        .withMessage('ticker symbol is required')
        .matches(/^[A-Z]+$/)
        .withMessage('ticker symbol must contain all uppercase letters'),
      body('amount')
        .not()
        .isEmpty()
        .withMessage('Amount is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Amount must be a positive Integer'),
      body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Price must be a positive Integer'),
      check('executionType')
        .isIn(['buy', 'sell'])
        .withMessage(
          'Execution Type must be either buy or sell (case sensitive)'
        ),
      check('userId').custom(async (value, { req }) => {
        return await poolDB
          .query('SELECT * FROM Users WHERE id = $1', [value])
          .then(userData => {
            if (userData.rows.length === 0) {
              return Promise.reject(`User with id : ${value} doesnt exist`);
            }
          });
      }),
      check('executionDate')
        .isISO8601()
        .toDate()
        .withMessage('Execution Date must be of format: YYYY-MM-DD HH:MM:SS'),
    ],
    postTrade
  );

router
  .route('/:id')
  .get(getSingleTrade)
  .put(
    [
      check('userId').custom(async (value, { req }) => {
        return await poolDB
          .query('SELECT * FROM Users WHERE id = $1', [value])
          .then(userData => {
            if (userData.rows.length === 0) {
              return Promise.reject(`User with id : ${value} doesnt exist`);
            }
          });
      }),
      body('ticker')
        .not()
        .isEmpty()
        .trim()
        .withMessage('ticker symbol is required')
        .matches(/^[A-Z]+$/)
        .withMessage('ticker symbol must contain all uppercase letters'),
      body('amount')
        .not()
        .isEmpty()
        .withMessage('Amount is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Amount must be a postive Integer'),
      body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Price must be a postive Integer'),
      check('executionType')
        .isIn(['buy', 'sell'])
        .withMessage(
          'Execution Type must be either buy or sell (case sensitive)'
        ),
      check('executionDate')
        .isISO8601()
        .toDate()
        .withMessage('Execution Date must be of format: YYYY-MM-DD HH:MM:SS'),
    ],
    updateTrade
  )
  .delete(
    [
      check('userId').custom(async (value, { req }) => {
        return await poolDB
          .query('SELECT * FROM Users WHERE id = $1', [value])
          .then(userData => {
            if (userData.rows.length === 0) {
              return Promise.reject(`User with id : ${value} doesnt exist`);
            }
          });
      }),
    ],
    deleteTrade
  );

export default router;
