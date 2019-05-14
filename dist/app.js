"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _auth = _interopRequireDefault(require("./routes/auth.routes"));

var _admin = _interopRequireDefault(require("./routes/admin.routes"));

var _client = _interopRequireDefault(require("./routes/client.routes"));

var _swagger = _interopRequireDefault(require("../swagger.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = process.env.PORT || 3000;
app.use((0, _morgan["default"])('dev')); // Parse incoming requests data

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // Routes which should handle requests

app.use('/api/auth', _auth["default"]);
app.use('/api', _admin["default"]);
app.use('/api', _client["default"]);
app.use('/documentation', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
app.get('/', function (req, res) {
  res.status(200).json({
    message: 'Welcome to Quick Credit application'
  });
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
var _default = app;
exports["default"] = _default;