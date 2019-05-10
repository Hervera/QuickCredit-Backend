import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import clientRoutes from './routes/client.routes';

const app = express();

// CORS
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  next();
});

app.use(morgan('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes which should handle requests
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', clientRoutes);

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

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at port ${port}...`);
});
