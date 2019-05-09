import bcrypt from 'bcryptjs';

const users = [
  {
    id: 1,
    email: 'herveralive@gmail.com',
    firstName: 'Herve',
    lastName: 'Nkuri',
    password: bcrypt.hashSync('secret', 10),
    status: 'verified',
    address: 'Kigali, Gasabo',
    isAdmin: 1,
    createdOn: 'March 3th 2019, 10:00:00 am',
  },
  {
    id: 2,
    email: 'brad@gmail.com',
    firstName: 'Brad',
    lastName: 'John',
    password: bcrypt.hashSync('secret', 10),
    status: 'unverified',
    address: 'Kigali, Nyarugenge',
    isAdmin: 0,
    createdOn: 'March 4th 2019, 03:00:00 pm',
  },
  {
    id: 3,
    email: 'johnLee@gmail.com',
    firstName: 'John',
    lastName: 'Lee',
    password: bcrypt.hashSync('secret', 10),
    status: 'verified',
    address: 'Kigali, Kicukiro',
    repaid: 0,
    createdOn: 'March 5th 2019, 07:00:00 am',
  },
];

const loans = [
  {
    id: 1,
    user: 'herveralive@gmail.com',
    createdOn: 'March 3th 2019, 10:00:00 am',
    status: 'pending',
    tenor: 4,
    repaid: 1,
    amount: 550000,
    paymentInstallment: 137500.025,
    balance: 100000,
    interest: 0.10,
  },
  {
    id: 2,
    user: 'brad@gmail.com',
    createdOn: 'March 4th 2019, 03:00:00 pm',
    status: 'approved',
    tenor: 6,
    repaid: 0,
    amount: 100000,
    paymentInstallment: 16666.7,
    balance: 20000,
    interest: 0.20,
  },
  {
    id: 3,
    user: 'johnLee@gmail.com',
    createdOn: 'March 5th 2019, 07:00:00 am',
    status: 'rejected',
    tenor: 8,
    repaid: 0,
    amount: 200000,
    paymentInstallment: 25000.03125,
    balance: 50000,
    interest: 0.25,
  },
];

export default {
  users, loans,
};
