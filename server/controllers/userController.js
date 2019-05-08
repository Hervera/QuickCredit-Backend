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

  // Get specific user details
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
        error: error.message, // error.details to view more about the error
      });
    }
    mock.users.map((user) => {
      if (user.id === id) {
        return res.status(200).json({
          status: 200,
          data: user,
        });
      }
    });
    return res.status(404).json({
      status: 404,
      error: 'User is not found',
    });
  },
};

export default users;
