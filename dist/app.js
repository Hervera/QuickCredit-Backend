'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _auth = require('./routes/auth.routes');

var _auth2 = _interopRequireDefault(_auth);

var _admin = require('./routes/admin.routes');

var _admin2 = _interopRequireDefault(_admin);

var _client = require('./routes/client.routes');

var _client2 = _interopRequireDefault(_client);

var _swagger = require('../swagger.json');

var _swagger2 = _interopRequireDefault(_swagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var port = process.env.PORT || 3000;

app.use((0, _morgan2.default)('dev'));
// Parse incoming requests data
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// Routes which should handle requests
app.use('/api/v1/auth', _auth2.default);
app.use('/api/v1', _admin2.default);
app.use('/api/v1', _client2.default);
app.use('/documentation', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_swagger2.default));

app.get('/', function (req, res) {
  res.status(200).json({ message: 'Welcome to Quick Credit application' });
});

app.use(function (req, res, next) {
  var error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use(function (error, req, res) {
  res.status(error.status || 500);
  res.json({
    status: 404,
    error: error.message
  });
});

app.listen(port);

exports.default = app;