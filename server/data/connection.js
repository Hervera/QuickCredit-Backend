import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = {};
if (process.env.NODE_ENV === 'test') {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_TEST_URL,
  });
} else {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
