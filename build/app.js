"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tradesRoutes_1 = __importDefault(require("./routes/tradesRoutes"));
const queryRoutes_1 = __importDefault(require("./routes/queryRoutes"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const error_1 = require("./controllers/error");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//Enable All CORS Requests
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/trades', tradesRoutes_1.default);
app.use('/api/query', queryRoutes_1.default);
app.get('/', (req, res, next) => {
    res.status(200).json({ message: 'API is running...' });
});
app.use(error_1.get404);
app.use(errorMiddleware_1.default);
app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT} `);
});
