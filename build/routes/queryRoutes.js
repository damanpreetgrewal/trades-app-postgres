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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const queryController_1 = require("../controllers/queryController");
const connection_1 = require("../db/connection");
const router = express_1.default.Router();
router.route('/').post([
    (0, express_validator_1.check)('userId')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield connection_1.poolDB
            .query('SELECT * FROM Users WHERE id = $1', [value])
            .then(userData => {
            if (userData.rows.length === 0) {
                return Promise.reject(`User with id : ${value} doesnt exist`);
            }
        });
    }))
        .optional(),
    (0, express_validator_1.check)('executionType')
        .isIn(['buy', 'sell'])
        .withMessage('Execution Type must be either buy or sell (case sensitive)')
        .optional(),
    (0, express_validator_1.check)('executionStartDate')
        .isISO8601()
        .toDate()
        .withMessage('ExecutionStartDate must be of format: YYYY-MM-DD HH:MM:SS')
        .optional(),
    (0, express_validator_1.check)('executionEndDate')
        .isISO8601()
        .toDate()
        .withMessage('ExecutionEndDate must be of format: YYYY-MM-DD HH:MM:SS')
        .optional(),
], queryController_1.getTradesSummary);
exports.default = router;
