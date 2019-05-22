import Joi from 'joi';
import moment from 'moment';
import db from '../data/connection';
import queries from '../data/queries';
import validate from '../helpers/validation';

class UserController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const allUsers = await db.query(queries.allUsers);
      if (allUsers.rows.length === 0) {
        res.status(404).json({
          status: 404,
          error: 'No user found',
        });
      }
      return res.status(200).json({
        status: 200,
        successMessage: 'Users',
        data: allUsers.rows,
      });
    } catch (er) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${er}`,
      });
    }
  }

  // Get a specific user details
  static async getSpecificUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { error } = Joi.validate(
        {
          id,
        },
        validate.idParams,
      );
      if (error) {
        return res.status(400).json({
          status: res.statusCode,
          error: error.details[0].message, // error.details to view more about the error
        });
      }
      const user = await db.query(queries.getUserById, [id]);
      if (user.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'User is not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: {
          id: user.rows[0].id,
          email: user.rows[0].email,
          firstName: user.rows[0].firstname,
          lastName: user.rows[0].lastname,
          status: user.rows[0].status,
          address: user.rows[0].address,
          isAdmin: user.rows[0].isadmin,
          createdOn: user.rows[0].createdon,
        },
      });
    } catch (er) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${er}`,
      });
    }
  }

  static async verifyUser(req, res) {
    try {
      const { email } = req.params;
      const { error } = Joi.validate(
        {
          email,
        },
        validate.emailParams,
      );

      if (error) {
        return res.status(400).json({
          status: res.statusCode,
          error: error.details[0].message, // error.details to view more about the error
        });
      }
      const user = await db.query(queries.getUserByEmail, [email]);
      if (user.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'User is not found',
        });
      }
      const updateDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const updatedUser = await db.query(queries.verifyUser, ['verified', updateDate, user.rows[0].email]);
      return res.status(200).json({
        status: 200,
        data: {
          id: updatedUser.rows[0].id,
          email: updatedUser.rows[0].email,
          firstName: updatedUser.rows[0].firstname,
          lastName: updatedUser.rows[0].lastname,
          status: updatedUser.rows[0].status,
          address: updatedUser.rows[0].address,
          isAdmin: updatedUser.rows[0].isadmin,
          createdOn: updatedUser.rows[0].createdon,
          updatedOn: updatedUser.rows[0].updatedon,
        },
      });
    } catch (er) {
      return res.status(500).json({
        status: res.statusCode,
        error: `${er}`,
      });
    }
  }
}

export default UserController;
