"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolDB = void 0;
const pg_1 = require("pg");
const poolDB = new pg_1.Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
exports.poolDB = poolDB;
