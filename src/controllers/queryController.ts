import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { poolDB } from '../db/connection';
import CustomError from '../customTypes/errorType';
import { formatDate } from '../utils/formatDate';

// @desc Get Trades Summary
// @route GET /api/query
// @access Public
export const getTradesSummary = asyncHandler(
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

      let query = `SELECT t.* FROM Trades t WHERE `;

      const reqBodyFields = Object.entries(req.body);

      const values = [];
      if (reqBodyFields.length === 0) {
        query = `SELECT t.* FROM Trades t ORDER BY 1 ASC`;
      } else {
        for (let i = 0; i < reqBodyFields.length; i++) {
          switch (reqBodyFields[i][0]) {
            case 'userId':
              i == reqBodyFields.length - 1
                ? (query += `userid = $${i + 1} `)
                : (query += `userid = $${i + 1} AND `);
              values.push(reqBodyFields[i][1]);
              break;
            case 'executionType':
              i == reqBodyFields.length - 1
                ? (query += `executiontype = $${i + 1}`)
                : (query += `executiontype = $${i + 1} AND `);
              values.push(reqBodyFields[i][1]);
              break;
            case 'executionStartDate':
              i == reqBodyFields.length - 1
                ? (query += `executiondate >= $${i + 1}`)
                : (query += `executiondate >= $${i + 1} AND `);
              values.push(reqBodyFields[i][1]);
              break;
            case 'executionEndDate':
              i == reqBodyFields.length - 1
                ? (query += `executiondate <= $${i + 1}`)
                : (query += `executiondate <= $${i + 1} AND `);
              values.push(reqBodyFields[i][1]);
              break;
            case 'default':
              break;
          }
        }
      }
      const response = await poolDB.query(query, values);
      const trades = response.rows;
      if (trades.length === 0) {
        res.status(200).json({ message: 'No Trades found.' });
      }
      const transformedTrades = trades.map(trade => {
        return {
          id: trade.id,
          ticker: trade.ticker,
          amount: Number(trade.amount),
          price: Number(trade.price),
          executionType: trade.executiontype,
          executionDate: formatDate(trade.executiondate),
          userId: Number(trade.userid),
        };
      });

      res.status(200).json(transformedTrades);
    } catch (err) {
      return next(err);
    }
  }
);
