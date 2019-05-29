"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon) {
  _classCallCheck(this, User);

  this.firstname = firstname;
  this.lastname = lastname;
  this.email = email;
  this.password = password;
  this.address = address;
  this.status = status;
  this.isadmin = isadmin;
  this.createdon = createdon;
  this.updatedon = updatedon;
};

exports.default = User;