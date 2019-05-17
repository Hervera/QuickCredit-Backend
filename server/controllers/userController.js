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
      // Remove of password in each object of the
      // for (let i = 0, len = mock.users.length; i < len; i++) {
      //   delete mock.users[i].password;
      // }
      // or use map() instead of for loop
      const newUsersArray = mock.users.map((eachItem) => {
        const item = eachItem;
        delete item.password;
        return item;
      });
      res.status(200).json({
        status: 200,
        successMessage: 'Users',
        data: newUsersArray,
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
    delete user.password;
    if (user) {
      return res.status(200).json({
        status: 200,
        data: user,
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
    delete user.password; // remove the password from the object you want to display in the output
    if (user) {
      user.status = 'verified';
      return res.status(200).json({
        status: 200,
        data: user,
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'User is not found',
    });
  },
};

export default users;
