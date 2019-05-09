import Joi from 'joi';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import mock from '../data/mock';
import validate from '../helpers/validation';

const auth = {
  register(req, res) {
    const {
      firstName, lastName, email, password, isAdmin, address,
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
    const uniqueUser = mock.users.filter(user => user.email === email);
    if (uniqueUser.length === 1) {
      return res.status(404).json({
        status: 404,
        error: `User with this email:${JSON.stringify(email)} is already registered`,
      });
    }
    const id = mock.users.length + 1;
    const status = 'unverified';
    const createdDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    const user = new User(
      id, firstName, lastName, email, password, address, status, isAdmin, createdDate,
    );
    const userId = user.id;
    const userFistname = user.firstName;
    const userLastname = user.lastName;
    const userEmail = user.email;
    const userPassword = user.password;
    const userAddress = user.address;
    const userStatus = user.status;
    const userIsAdmin = user.isAdmin;
    const userDate = user.createdDate;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const token = jwt.sign({ user: mock.users.push(user) }, 'secret-key');
    return res.status(201).send({
      status: res.statusCode,
      data: {
        token,
        userId,
        userFistname,
        userLastname,
        userEmail,
        userPassword,
        userAddress,
        userStatus,
        userIsAdmin,
        userDate,
      },
    });
  },

  login(req, res) {
    const { email, password } = req.body;

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
    for (let i = 0; i < mock.users.length; i++) {
      if (mock.users[i].email === email) {
        const { id } = mock.users[i];
        const { firstName } = mock.users[i];
        const { lastName } = mock.users[i];
        const { status } = mock.users[i];
        const { isAdmin } = mock.users[i];
        const { createdOn } = mock.users[i];
        const truePass = bcrypt.compareSync(password, mock.users[i].password);
        if (truePass) {
          const token = jwt.sign({ user: mock.users[i].password }, 'secret-key', { expiresIn: '1h' });
          return res.status(200).send({
            status: res.statusCode,
            data: {
              token, id, firstName, lastName, email, status, isAdmin, createdOn,
            },
          });
        }
        return res.status(400).send({
          status: res.statusCode,
          error: 'incorrect password',
        });
      }
    }
    return res.status(400).send({ status: 400, error: 'invalid email' });
  },
};

export default auth;
