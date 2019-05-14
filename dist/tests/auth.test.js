"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-undef */
_chai["default"].should();

_chai["default"].use(_chaiHttp["default"]);

describe('User authentication Endpoints', function () {
  it('Should not create an account if input are not validated', function (done) {
    var user = {
      firstName: '445',
      lastName: '',
      email: 'hervera12@gmail.com',
      password: 'secret',
      address: 'Kigali, Gasabo'
    };

    _chai["default"].request(_app["default"]).post('/api/auth/signup').send(user).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
  it('Should not create an account if user emailalready exists', function (done) {
    var user = {
      firstName: 'nkuli',
      lastName: 'hervera',
      email: 'hervera@gmail.com',
      password: 'secret',
      address: 'Kigali, Gasabo'
    };

    _chai["default"].request(_app["default"]).post('/api/auth/signup').send(user).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(404);
      res.body.should.have.property('error');
      done();
    });
  });
  it('Should create an account', function (done) {
    var user = {
      firstName: 'Herve',
      lastName: 'Nkuri',
      email: 'hervera12@gmail.com',
      password: 'secret',
      address: 'Kigali, Gasabo'
    };

    _chai["default"].request(_app["default"]).post('/api/auth/signup').send(user).set('Accept', 'Application/JSON').end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(201);
      res.body.should.have.property('data');
      res.body.data.should.be.an('Object');
      done();
    });
  });
  it('Should be able to login', function (done) {
    var login = {
      email: 'hervera@gmail.com',
      password: 'secret'
    };

    _chai["default"].request(_app["default"]).post('/api/auth/signin').send(login).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('data');
      res.body.data.should.be.an('Object');
      done();
    });
  });
  it('Should not login a user if email is incorrect', function (done) {
    var login = {
      email: 'xxxxxxx@gmail.com',
      password: 'secret'
    };

    _chai["default"].request(_app["default"]).post('/api/auth/signin').send(login).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
  it('Should not login a user if password is incorrect', function (done) {
    var login = {
      email: 'hervera@gmail.com',
      password: 'xxxxxxxx'
    };

    _chai["default"].request(_app["default"]).post('/api/auth/signin').send(login).end(function (err, res) {
      res.body.should.be.an('Object');
      res.body.should.have.property('status').equal(400);
      res.body.should.have.property('error');
      done();
    });
  });
});