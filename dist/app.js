"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _auth = _interopRequireDefault(require("./routes/auth.routes"));

var _admin = _interopRequireDefault(require("./routes/admin.routes"));

var _client = _interopRequireDefault(require("./routes/client.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); // CORS

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use((0, _morgan["default"])('dev')); // Parse incoming requests data

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // Routes which should handle requests

app.use('/api/auth', _auth["default"]);
app.use('/api', _admin["default"]);
app.use('/api', _client["default"]);
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
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server running at port ".concat(port, "..."));
});
var _default = app;
exports["default"] = _default;