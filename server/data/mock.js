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
    isAdmin: 0,
    createdOn: 'March 5th 2019, 07:00:00 am',
  },
];

export default {
  users,
};
