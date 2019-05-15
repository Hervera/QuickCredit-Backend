import '@babel/polyfill';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import clientRoutes from './routes/client.routes';
import swaggerDocument from '../swagger.json';

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes which should handle requests
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', clientRoutes);
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Quick Credit application' });
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    status: (404),
    error: error.message,
  });
});

// app.listen(port);
app.listen(port, () => {
  console.log(`Server running at port ${port}...`);
});


export default app;
