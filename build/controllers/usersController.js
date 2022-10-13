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
exports.postUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const connection_1 = require("../db/connection");
const errorType_1 = __importDefault(require("../customTypes/errorType"));
// @desc Get All Users
// @route GET /api/users
// @access Public
exports.getUsers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = `SELECT u.* FROM Users u ORDER BY 1 ASC `;
        const response = yield connection_1.poolDB.query(query);
        const users = response.rows;
        if (users.length === 0) {
            res.status(200).json({ message: 'No Users found.' });
        }
        res.status(200).json(users);
    }
    catch (err) {
        return next(err);
    }
}));
// @desc Post a User
// @route POST /api/users
// @access Public
exports.postUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new errorType_1.default(422, 'Validation failed, entered data is incorrect.', errors.array());
            throw error;
        }
        const user = yield connection_1.poolDB.query('INSERT INTO Users(name) VALUES ($1) RETURNING *', [req.body.name]);
        res.status(201).json({
            message: 'User posted successfully.',
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
            },
        });
    }
    catch (err) {
        return next(err);
    }
}));
