"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    const additionalErrors = { validationsErrors: Object.assign({}, err.validationErrors) };
    res.json(Object.assign(Object.assign({ message: err.message }, additionalErrors), { stack: process.env.NODE_ENV === 'production' ? null : err.stack }));
};
exports.default = errorHandler;
