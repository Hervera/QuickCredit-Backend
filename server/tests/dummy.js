const user1 = {
  firstname: '445',
  lastname: '',
  email: 'admin12@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo',
};

const adminUser = {
  firstname: 'Admin',
  lastname: 'QuickCredit',
  email: 'admin@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo',
};

const newUser = {
  firstname: 'client',
  lastname: 'quickCredit',
  email: 'client@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo',
};

const authUser = {
  email: 'client@gmail.com',
  password: 'secret',
};

const falseUserEmail = {
  email: 'xxxxxxx@gmail.com',
  password: 'secret',
};

const falseUserPassword = {
  email: 'client@gmail.com',
  password: 'xxxxxxxx',
};

const newLoan = {
  useremail: 'kevin5@gmail.com',
  tenor: 4,
  amount: 550000,
};

const fakeLoan1 = {
  useremail: 'xxxxxxxx@gmail.com',
  tenor: 4,
  amount: 550000,
};

const fakeLoan2 = {
  useremail: 'xxxxxxxx',
  tenor: 4,
  amount: 550000,
};

const LoanStatus = {
  status: 'approved',
};

const paidamount = {
  paidamount: 5000000,
};

export default {
  user1, adminUser, newUser, authUser, falseUserEmail, falseUserPassword, newLoan, fakeLoan1, fakeLoan2, LoanStatus, paidamount,
};
