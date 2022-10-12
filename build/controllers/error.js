"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get404 = void 0;
const get404 = (req, res, next) => {
    res.status(404).json({ message: 'Invalid API Route' });
};
exports.get404 = get404;
