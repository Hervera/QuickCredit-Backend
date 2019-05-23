import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../data/connection';
import queries from '../data/queries';

dotenv.config();

class AuthMiddleware {
  static async verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: '30min',
      };
      try {
        const user = jwt.verify(token, `${process.env.SECRET_KEY_CODE}`, options);
        const { rows } = await db.query(queries.getUserById, [user.id]);
        if (!rows[0]) {
          return res.status(400).send({
            status: res.statusCode,
            error: 'Token expired',
          });
        }
        req.decoded = user;
        return next();
      } catch (error) {
        // Throw an error just in case anything goes wrong with verification
        return res.status(400).send({
          status: res.statusCode,
          error: 'Invalid token',
        });
      }
    } else {
      // Forbidden
      return res.status(403).send({
        status: res.statusCode,
        error: "'Unauthorized, No token provided",
      });
    }
  }

  static verifyAdmin(req, res, next) {
    const payload = req.decoded;
    if ((payload && payload.isadmin === true)) {
      next();
    } else {
      res.status(401).send({
        status: res.statusCode,
        error: 'Unauthorized, Contact QuickQredit admin',
      });
    }
  }

  static verifyClient(req, res, next) {
    const payload = req.decoded;
    if ((payload && payload.email === req.body.useremail)) {
      next();
    } else {
      res.status(401).send({
        status: res.statusCode,
        error: 'Unauthorized',
      });
    }
  }
}

export default AuthMiddleware;
