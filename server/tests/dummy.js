import randomEmail from 'random-email';

const user1 = {
  firstName: '445',
  lastName: '',
  email: 'admin12@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo',
};

const registeredUser = {
  firstName: 'nkuli',
  lastName: 'client',
  email: 'client@gmail.com',
  password: 'secret',
  address: 'Kigali, Gasabo',
};

const newUser = {
  firstName: 'Hervera',
  lastName: 'Nkuli',
  email: randomEmail(),
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
  userEmail: 'client@gmail.com',
  tenor: 4,
  amount: 550000,
};

const fakeLoan1 = {
  userEmail: 'xxxxxxxx@gmail.com',
  tenor: 4,
  amount: 550000,
};

const fakeLoan2 = {
  userEmail: 'xxxxxxxx',
  tenor: 4,
  amount: 550000,
};

const LoanStatus = {
  status: 'approved',
};

const paidAmount = {
  paidAmount: 5000000,
};

export default {
  user1, registeredUser, newUser, authUser, falseUserEmail, falseUserPassword, newLoan, fakeLoan1, fakeLoan2, LoanStatus, paidAmount,
};
