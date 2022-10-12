"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
router
    .route('/')
    .get(usersController_1.getUsers)
    .post([(0, express_validator_1.body)('name').not().isEmpty().trim().withMessage('Name is required')], usersController_1.postUser);
exports.default = router;
