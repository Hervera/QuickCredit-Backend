import Joi from 'joi';
import mock from '../data/mock';
import validate from '../helpers/validation';

const users = {

  // Get all users
  getAllUsers(req, res) {
    if (mock.users.length === 0) {
      res.status(404).json({
        status: 404,
        error: 'No user found',
      });
    } else {
      res.status(200).json({
        status: 200,
        successMessage: 'Users',
        data: mock.users,
      });
    }
  },

  // Get a specific user details
  getSpecificUser(req, res) {
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
    const user = mock.users.find(el => el.id === id);
    if (user) {
      return res.status(200).json({
        status: 200,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          address: user.address,
          isAdmin: user.isAdmin,
          createdOn: user.createdOn,
        },
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'User is not found',
    });
  },

  verifyUser(req, res) {
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
    const user = mock.users.find(el => el.email === email);
    if (user) {
      user.status = 'verified';
      return res.status(200).json({
        status: 200,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          address: user.address,
          isAdmin: user.isAdmin,
          createdOn: user.createdOn,
        },
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'User is not found',
    });
  },
};

export default users;
