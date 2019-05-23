import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import queries from './queries';

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

/**
 * Create Tables
 */
const createTables = () => new Promise(async (resolve, reject) => {
  try {
    await pool.query(queries.createTables);

    const admin = [
      'Herve',
      'Nkurikiyimfura',
      'admin@gmail.com',
      bcrypt.hashSync('secret', 10),
      'Kigali, Rwanda',
      'verified',
      'true',
      new Date(),
      new Date(),
    ];
    await pool.query(queries.insertAdmin, admin);
    resolve();
  } catch (error) {
    reject(error);
  }
});


/**
 * Drop Tables
 */
const dropTables = () => new Promise(async (resolve, reject) => {
  try {
    await pool.query(queries.dropTables);
    resolve();
  } catch (error) {
    reject(error);
  }
});

export {
  createTables, dropTables,
};

require('make-runnable');
