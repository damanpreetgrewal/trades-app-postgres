"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrade = exports.updateTrade = exports.postTrade = exports.getTrades = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const connection_1 = require("../db/connection");
const errorType_1 = __importDefault(require("../customTypes/errorType"));
const formatDate_1 = require("../utils/formatDate");
// @desc Get all Trades
// @route GET /api/trades
// @access Public
exports.getTrades = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = `SELECT t.*,u.name FROM Trades t inner join Users u on t.userid = u.id order by 1 desc`;
        const response = yield connection_1.poolDB.query(query);
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
                executionDate: (0, formatDate_1.formatDate)(trade.executiondate),
                userId: Number(trade.userid),
                userName: trade.name,
            };
        });
        res.status(200).json(transformedTrades);
    }
    catch (err) {
        return next(err);
    }
}));
// @desc Post a trade
// @route POST /api/trades
// @access Public
const postTrade = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new errorType_1.default(422, 'Validation failed, entered data is incorrect.', errors.array());
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
        const trade = yield connection_1.poolDB.query('INSERT INTO Trades(ticker, amount, price, executiontype, executiondate, userid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', values);
        res.status(201).json({
            message: 'Trade posted successfully.',
            trade: {
                id: trade.rows[0].id,
                ticker: trade.rows[0].ticker,
                amount: Number(trade.rows[0].amount),
                price: Number(trade.rows[0].price),
                executionType: trade.rows[0].executiontype,
                executionDate: (0, formatDate_1.formatDate)(trade.rows[0].executiondate),
                userId: Number(trade.rows[0].userid),
            },
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.postTrade = postTrade;
// @desc Update a trade
// @route PUT /api/trades/:id
// @access Public
const updateTrade = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new errorType_1.default(422, 'Validation failed, entered data is incorrect.', errors.array());
            throw error;
        }
        let query = `SELECT t.*,u.name FROM Trades t inner join Users u on t.userid = u.id WHERE t.id = $1 order by 1 desc`;
        const queryResponse = yield connection_1.poolDB.query(query, [req.params.id]);
        const trade = queryResponse.rows;
        if (trade.length === 0) {
            res
                .status(200)
                .json({ message: `Trade with id: ${req.params.id} not found.` });
        }
        //Make sure the userId of the Trade matches the userId in the DB
        if (trade[0].userid !== req.body.userId) {
            throw new errorType_1.default(401, 'User who does not own the trade cannot update the trade', []);
        }
        if (trade[0].executiondate < new Date()) {
            throw new errorType_1.default(401, 'Trades that have Execution Date in the past cannot be updated', []);
        }
        const reqBodyFields = Object.entries(req.body);
        let updateQuery = 'UPDATE Trades SET ';
        const values = [];
        for (let i = 0; i < reqBodyFields.length; i++) {
            if (i !== reqBodyFields.length - 1) {
                updateQuery += `${reqBodyFields[i][0]} = $${i + 1},`;
                values.push(reqBodyFields[i][1]);
            }
            else {
                updateQuery += `${reqBodyFields[i][0]} = $${i + 1}`;
                values.push(reqBodyFields[i][1]);
            }
        }
        updateQuery += ` WHERE id = $${values.length + 1} RETURNING *`;
        values.push(req.params.id);
        const updatedTrade = yield connection_1.poolDB.query(updateQuery, values);
        res.status(201).json({
            message: 'Trade updated successfully.',
            trade: {
                id: updatedTrade.rows[0].id,
                ticker: updatedTrade.rows[0].ticker,
                amount: Number(updatedTrade.rows[0].amount),
                price: Number(updatedTrade.rows[0].price),
                executionType: updatedTrade.rows[0].executiontype,
                executionDate: (0, formatDate_1.formatDate)(updatedTrade.rows[0].executiondate),
                userId: Number(updatedTrade.rows[0].userid),
            },
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.updateTrade = updateTrade;
// @desc Delete a Trade
// @route DELETE /api/trades/:id
// @access Public
const deleteTrade = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new errorType_1.default(422, 'Validation failed, entered data is incorrect.', errors.array());
            throw error;
        }
        let query = `SELECT t.*,u.name FROM Trades t inner join Users u on t.userid = u.id WHERE t.id = $1 order by 1 desc`;
        const queryResponse = yield connection_1.poolDB.query(query, [req.params.id]);
        const trade = queryResponse.rows;
        if (trade.length === 0) {
            res
                .status(200)
                .json({ message: `Trade with id: ${req.params.id} not found.` });
        }
        //Make sure the userId of the Trade matches the userId in the DB
        if (trade[0].userid !== req.body.userId) {
            throw new errorType_1.default(401, 'User who does not own the trade cannot update the trade', []);
        }
        if (trade[0].executiondate < new Date()) {
            throw new errorType_1.default(401, 'Trades that have Execution Date in the past cannot be updated', []);
        }
        const deletedTrade = yield connection_1.poolDB.query(`DELETE FROM Trades WHERE id=$1 RETURNING *`, [req.params.id]);
        res.status(201).json({
            message: 'Trade deleted successfully.',
            trade: {
                id: deletedTrade.rows[0].id,
                ticker: deletedTrade.rows[0].ticker,
                amount: Number(deletedTrade.rows[0].amount),
                price: Number(deletedTrade.rows[0].price),
                executionType: deletedTrade.rows[0].executiontype,
                executionDate: (0, formatDate_1.formatDate)(deletedTrade.rows[0].executiondate),
                userId: Number(deletedTrade.rows[0].userid),
            },
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteTrade = deleteTrade;