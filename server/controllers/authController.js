import Joi from 'joi';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import db from '../data/connection';
import validate from '../helpers/validation';
import queries from '../data/queries';
import Helper from '../helpers/passwordCompare';

dotenv.config();

class AuthController {
  static async register(req, res) {
    const {
      firstname, lastname, email, password, address,
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
    const status = 'unverified';
    const createdon = moment().format('YYYY-MM-DD HH:mm:ss');
    const updatedon = moment().format('YYYY-MM-DD HH:mm:ss');
    const isadmin = 'false';
    const user = new User(
      firstname, lastname, email, password, address, status, isadmin, createdon, updatedon,
    );
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const values = [
      user.firstname,
      user.lastname,
      user.email,
      user.password,
      user.address,
      user.status,
      user.isadmin,
      user.createdon,
      user.updatedon,
    ];
    try {
      const payload = await db.query(queries.insertUser, values);
      // create token
      const token = jwt.sign(payload.rows[0], `${process.env.SECRET_KEY_CODE}`, { expiresIn: '2d' });
      return res.status(201).send({
        status: res.statusCode,
        data: {
          token,
          id: payload.rows[0].id,
          fistName: payload.rows[0].firstname,
          lastname: payload.rows[0].lastname,
          email: payload.rows[0].email,
          address: payload.rows[0].address,
          status: payload.rows[0].status,
          isadmin: payload.rows[0].isadmin,
          CreatedOn: payload.rows[0].createdon,
        },
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: res.statusCode,
          error: 'User with that EMAIL already exist',
        });
      }
      return res.status(500).json({ status: 500, error: `error ${error}` });
    }
  }

  static async login(req, res) {
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
    try {
      const { rows } = await db.query(queries.getUserByEmail, [req.body.email]);
      if (rows.length === 0) {
        return res.status(400).send({
          status: res.statusCode,
          error: 'User with that email is not found',
        });
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'Incorrect password',
        });
      }
      const options = { expiresIn: '2d' };
      const token = jwt.sign(rows[0], `${process.env.SECRET_KEY_CODE}`, options);
      console.log(res.locals.user);
      return res.status(200).send({
        status: res.statusCode,
        data: {
          token,
          id: rows[0].id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          isadmin: rows[0].isadmin,
          email: rows[0].email,
          address: rows[0].address,
        },
      });
    } catch (er) {
      return res.status(400).send({
        status: res.statusCode,
        error: `error ${er}`,
      });
    }
  }
}

export default AuthController;
