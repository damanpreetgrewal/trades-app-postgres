import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import tradesRoutes from './routes/tradesRoutes';
import queryRoutes from './routes/queryRoutes';
import errorHandler from './middleware/errorMiddleware';

import { get404 } from './controllers/error';

const app: Application = express();
const PORT = process.env.PORT || 5000;

//Enable All CORS Requests
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/trades', tradesRoutes);
app.use('/api/query', queryRoutes);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'API is running...' });
});

app.use(get404);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT} `
  );
});
