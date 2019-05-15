"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(id, firstName, lastName, email, password, address, status, isAdmin, createdOn) {
  _classCallCheck(this, User);

  this.id = id;
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.password = password;
  this.address = address;
  this.status = status;
  this.isAdmin = isAdmin;
  this.createdOn = createdOn;
};

exports.default = User;