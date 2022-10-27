import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { poolDB } from '../db/connection';
import CustomError from '../customTypes/errorType';

// @desc Get All Users
// @route GET /api/users
// @access Public
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = `SELECT u.* FROM Users u ORDER BY 1 ASC `;

      const response = await poolDB.query(query);
      const users = response.rows;
      if (users.length === 0) {
        res.status(200).json({ message: 'No Users found.' });
      }

      res.status(200).json(users);
    } catch (err) {
      return next(err);
    }
  }
);

// @desc Post a User
// @route POST /api/users
// @access Public
export const postUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new CustomError(
          422,
          'Validation failed, entered data is incorrect.',
          errors.array() as []
        );
        throw error;
      }
      const user = await poolDB.query(
        'INSERT INTO Users(name) VALUES ($1) RETURNING *',
        [req.body.name]
      );

      res.status(201).json({
        message: 'User posted successfully.',
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);