import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = {
  async verifyToken(req, res, next) {
    const authorizationHeaader = req.headers.authorization; // Express headers are auto converted to lowercase
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      let result;
      const options = {
        expiresIn: '2d',
      };
      try {
        // verify makes sure that the token hasn't expired
        result = jwt.verify(token, `${process.env.SECRET_KEY_CODE}`, options);
        req.decoded = result;
        // We call next to pass execution to the subsequent middleware
        next();
      } catch (error) {
        // Throw an error just in case anything goes wrong with verification
        res.status(400).send({
          status: res.statusCode,
          error: 'Invalid token',
        });
      }
    } else {
      // Forbidden
      res.status(403).send({
        status: res.statusCode,
        error: "'Unauthorized, No token provided",
      });
    }
  },
};

export default auth;
