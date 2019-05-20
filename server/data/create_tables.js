import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


console.log(process.env.DATABASE_URL);

pool.on('connect', () => {
  console.log('connected to the db');
});


/**
 * Create Tables
 */

const createTables = () => new Promise(async (resolve, reject) => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL NOT NULL PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      isAdmin BOOLEAN NOT NULL,
      status VARCHAR(255) NOT NULL,
      createdOn TIMESTAMP,
      updatedOn TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS
    loans(
      id SERIAL NOT NULL PRIMARY KEY,
      userID INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(255) NOT NULL,
      repaid BOOLEAN NOT NULL,
      tenor INTEGER NOT NULL,
      amount NUMERIC NOT NULL,
      paymentInstallment VARCHAR(255) NOT NULL,
      balance NUMERIC NOT NULL,
      interest NUMERIC NOT NULL,
      createdOn TIMESTAMP,
      updatedOn TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS
    repayments(
      id SERIAL NOT NULL PRIMARY KEY,
      loadId INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
      paidAmount NUMERIC NOT NULL,
      monthlyInstallment VARCHAR(255) NOT NULL,
      repaid BOOLEAN NOT NULL,
      balance NUMERIC NOT NULL,
      remain NUMERIC NOT NULL,
      createdOn TIMESTAMP,
      updatedOn TIMESTAMP
    );`;

  try {
    await pool.query(queryText);
    resolve();
  } catch (error) {
    reject(error);
  }
});


/**
 * Drop Tables
 */
const dropTables = () => new Promise(async (resolve, reject) => {
  const queryText = `DROP TABLE IF EXISTS users CASCADE;
                     DROP TABLE IF EXISTS loans CASCADE;
                     DROP TABLE IF EXISTS repayments CASCADE;
                    `;

  try {
    await pool.query(queryText);
    resolve();
  } catch (error) {
    reject(error);
  }
});

export {
  createTables, dropTables,
};

require('make-runnable');
