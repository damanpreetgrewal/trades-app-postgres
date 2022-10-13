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
exports.getTradesSummary = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const connection_1 = require("../db/connection");
const errorType_1 = __importDefault(require("../customTypes/errorType"));
const formatDate_1 = require("../utils/formatDate");
// @desc Get Trades Summary
// @route GET /api/query
// @access Public
exports.getTradesSummary = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new errorType_1.default(422, 'Validation failed, entered data is incorrect.', errors.array());
            throw error;
        }
        let query = `SELECT t.* FROM Trades t WHERE `;
        const reqBodyFields = Object.entries(req.body);
        const values = [];
        if (reqBodyFields.length === 0) {
            query = `SELECT t.* FROM Trades t ORDER BY 1 ASC`;
        }
        else {
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
        const response = yield connection_1.poolDB.query(query, values);
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
            };
        });
        res.status(200).json(transformedTrades);
    }
    catch (err) {
        return next(err);
    }
}));
