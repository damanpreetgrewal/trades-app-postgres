import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { poolDB } from '../db/connection';
import CustomError from '../customTypes/errorType';
import { formatDate } from '../utils/formatDate';

// @desc Get all Trades
// @route GET /api/trades
// @access Public
export const getTrades = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = `SELECT t.*,u.name FROM Trades t INNER JOIN Users u on t.userid = u.id ORDER BY 1 ASC`;
      const response = await poolDB.query(query);
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
          userName: trade.name,
        };
      });

      res.status(200).json(transformedTrades);
    } catch (err) {
      return next(err);
    }
  }
);

// @desc Get Single Trade
// @route GET /api/trades/:id
// @access Public
export const getSingleTrade = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = `SELECT t.*,u.name FROM Trades t INNER JOIN Users u on t.userid = u.id WHERE t.id=$1`;
      const response = await poolDB.query(query, [req.params.id]);
      const trades = response.rows;
      if (trades.length === 0) {
        res
          .status(200)
          .json({ message: `Trade with id: ${req.params.id} not found.` });
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
          userName: trade.name,
        };
      });

      res.status(200).json(transformedTrades);
    } catch (err) {
      return next(err);
    }
  }
);

// @desc Post a trade
// @route POST /api/trades
// @access Public
export const postTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const values = [
      req.body.ticker,
      req.body.amount,
      req.body.price,
      req.body.executionType,
      req.body.executionDate,
      req.body.userId,
    ];

    const trade = await poolDB.query(
      'INSERT INTO Trades(ticker, amount, price, executiontype, executiondate, userid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      values
    );

    res.status(201).json({
      message: 'Trade posted successfully.',
      trade: {
        id: trade.rows[0].id,
        ticker: trade.rows[0].ticker,
        amount: Number(trade.rows[0].amount),
        price: Number(trade.rows[0].price),
        executionType: trade.rows[0].executiontype,
        executionDate: formatDate(trade.rows[0].executiondate),
        userId: Number(trade.rows[0].userid),
      },
    });
  } catch (err) {
    return next(err);
  }
};

// @desc Update a trade
// @route PUT /api/trades/:id
// @access Public
export const updateTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    let query = `SELECT t.*,u.name FROM Trades t INNER JOIN Users u on t.userid = u.id WHERE t.id = $1 ORDER BY 1 ASC`;
    const queryResponse = await poolDB.query(query, [req.params.id]);
    const trade = queryResponse.rows;
    if (trade.length === 0) {
      res
        .status(200)
        .json({ message: `Trade with id: ${req.params.id} not found.` });
    }

    //Make sure the userId of the Trade matches the userId in the DB
    if (trade[0].userid !== req.body.userId) {
      throw new CustomError(
        401,
        'User who does not own the trade cannot update the trade',
        []
      );
    }

    if (trade[0].executiondate < new Date()) {
      throw new CustomError(
        401,
        'Trades that have Execution Date in the past cannot be updated',
        []
      );
    }

    const reqBodyFields = Object.entries(req.body);

    let updateQuery = 'UPDATE Trades SET ';
    const values = [];
    for (let i = 0; i < reqBodyFields.length; i++) {
      switch (reqBodyFields[i][0]) {
        case 'ticker':
          i == reqBodyFields.length - 1
            ? (updateQuery += `ticker = $${i + 1} `)
            : (updateQuery += `ticker = $${i + 1}, `);
          values.push(reqBodyFields[i][1]);
          break;
        case 'amount':
          i == reqBodyFields.length - 1
            ? (updateQuery += `amount = $${i + 1} `)
            : (updateQuery += `amount = $${i + 1}, `);
          values.push(reqBodyFields[i][1]);
          break;
        case 'price':
          i == reqBodyFields.length - 1
            ? (updateQuery += `price = $${i + 1} `)
            : (updateQuery += `price = $${i + 1}, `);
          values.push(reqBodyFields[i][1]);
          break;
        case 'executionType':
          i == reqBodyFields.length - 1
            ? (updateQuery += `executiontype = $${i + 1} `)
            : (updateQuery += `executionType = $${i + 1}, `);
          values.push(reqBodyFields[i][1]);
          break;
        case 'executionDate':
          i == reqBodyFields.length - 1
            ? (updateQuery += `executiondate = $${i + 1} `)
            : (updateQuery += `executiondate = $${i + 1}, `);
          values.push(reqBodyFields[i][1]);
          break;
        case 'userId':
          i == reqBodyFields.length - 1
            ? (updateQuery += `userid = $${i + 1} `)
            : (updateQuery += `userid = $${i + 1}, `);
          values.push(reqBodyFields[i][1]);
          break;
        case 'default':
          break;
      }
    }
    updateQuery += ` WHERE id = $${values.length + 1} RETURNING *`;
    values.push(req.params.id);

    const updatedTrade = await poolDB.query(updateQuery, values);

    res.status(201).json({
      message: 'Trade updated successfully.',
      trade: {
        id: updatedTrade.rows[0].id,
        ticker: updatedTrade.rows[0].ticker,
        amount: Number(updatedTrade.rows[0].amount),
        price: Number(updatedTrade.rows[0].price),
        executionType: updatedTrade.rows[0].executiontype,
        executionDate: formatDate(updatedTrade.rows[0].executiondate),
        userId: Number(updatedTrade.rows[0].userid),
      },
    });
  } catch (err) {
    return next(err);
  }
};

// @desc Delete a Trade
// @route DELETE /api/trades/:id
// @access Public
export const deleteTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    let query = `SELECT t.*,u.name FROM Trades t INNER JOIN Users u on t.userid = u.id WHERE t.id = $1 ORDER BY 1 ASC`;
    const queryResponse = await poolDB.query(query, [req.params.id]);
    const trade = queryResponse.rows;
    if (trade.length === 0) {
      res
        .status(200)
        .json({ message: `Trade with id: ${req.params.id} not found.` });
    }

    //Make sure the userId of the Trade matches the userId in the DB
    if (trade[0].userid !== req.body.userId) {
      throw new CustomError(
        401,
        'User who does not own the trade cannot update the trade',
        []
      );
    }

    if (trade[0].executiondate < new Date()) {
      throw new CustomError(
        401,
        'Trades that have Execution Date in the past cannot be updated',
        []
      );
    }

    const deletedTrade = await poolDB.query(
      `DELETE FROM Trades WHERE id=$1 RETURNING *`,
      [req.params.id]
    );

    res.status(201).json({
      message: 'Trade deleted successfully.',
      trade: {
        id: deletedTrade.rows[0].id,
        ticker: deletedTrade.rows[0].ticker,
        amount: Number(deletedTrade.rows[0].amount),
        price: Number(deletedTrade.rows[0].price),
        executionType: deletedTrade.rows[0].executiontype,
        executionDate: formatDate(deletedTrade.rows[0].executiondate),
        userId: Number(deletedTrade.rows[0].userid),
      },
    });
  } catch (err) {
    return next(err);
  }
};
