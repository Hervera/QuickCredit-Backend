import Joi from 'joi';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import mock from '../data/mock';
import validate from '../helpers/validation';

dotenv.config();

const auth = {
  register(req, res) {
    const {
      firstName, lastName, email, password, address,
    } = req.body;

    const result = Joi.validate(req.body, validate.userSchema, { abortEarly: false });

    if (result.error) {
      const errors = [];
      for (let index = 0; index < result.error.details.length; index++) {
        errors.push(result.error.details[index].message.split('"').join(''));
      }
      return res.status(400).send({
        status: res.statusCode,
        error: errors,
      });
    }
    const uniqueUser = mock.users.find(user => user.email === email);
    if (uniqueUser) {
      return res.status(409).json({
        status: res.statusCode,
        error: `User with this email:${JSON.stringify(email)} is already registered`,
      });
    }
    const id = mock.users.length + 1;
    const status = 'unverified';
    const createdOn = moment().format('MMMM Do YYYY, h:mm:ss a');
    const isAdmin = 'false';
    const user = new User(
      id, firstName, lastName, email, password, address, status, isAdmin, createdOn,
    );
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const token = jwt.sign({ user: mock.users.push(user) }, `${process.env.SECRET_KEY_CODE}`);
    return res.status(201).send({
      status: res.statusCode,
      data: {
        token,
        id: user.id,
        fistName: firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        status: user.status,
        isAdmin: user.isAdmin,
        CreatedOn: user.createdOn,
      },
    });
  },

  login(req, res) {
    const { error } = Joi.validate(req.body, validate.loginSchema);
    if (error) {
      const errors = [];
      for (let index = 0; index < error.details.length; index++) {
        errors.push(error.details[index].message.split('"').join(''));
      }
      return res.status(400).send({
        status: res.statusCode,
        error: errors,
      });
    }

    const user = mock.users.find(findEmail => findEmail.email === req.body.email);
    if (!user) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'Invalid email',
      });
    }
    const passwordCompare = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordCompare) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'Incorrect password',
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const options = { expiresIn: '2d' };
    const token = jwt.sign(payload, `${process.env.SECRET_KEY_CODE}`, options);
    return res.status(200).send({
      status: res.statusCode,
      data: {
        token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        isAdmin: user.isAdmin,
        email: user.email,
        address: user.address,
      },
    });
  },
};

export default auth;
