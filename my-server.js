// server.js
import express from 'express';
import cors from 'cors';
import { handler } from './build/handler.js';

const app = express();

app.use(cors());

app.use((req, res, next) => {
  next();
});

app.use(handler);

app.listen(3000, () => {
  console.log('Node app is running on port 3000');
});
