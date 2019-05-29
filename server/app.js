import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import clientRoutes from './routes/clientRoutes';
import swaggerDocument from '../swagger.json';
import { createTables } from './data/tables';
// import cors from 'cors';

const app = express();

const port = process.env.PORT || 3000;

dotenv.config();

// createTables();

app.use(morgan('dev'));
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes which should handle requests
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2', adminRoutes);
app.use('/api/v2', clientRoutes);
app.get('/', (req, res) => res.redirect('/documentation'));
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((req, res) => res.status(404).send({
  status: 404,
  error: 'url is not found',
}));

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    status: (404),
    error: error.message,
  });
});

app.listen(port);

export default app;
