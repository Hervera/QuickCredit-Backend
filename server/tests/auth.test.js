import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../app';
import dummy from './dummy';
import db from '../data/connection';
import queries from '../data/queries';
import { createTables, dropTables } from '../data/tables';

chai.should();
chai.use(chaiHttp);

beforeEach(async () => {
  await dropTables();
  await createTables();

  // Create a user before testing other user related tests
  const user = {
    firstname: 'client',
    lastname: 'client',
    email: 'client@gmail.com',
    password: 'secret',
    address: 'Kigali',
    status: 'verified',
    isadmin: 'true',
    createdon: new Date(),
    updatedon: new Date(),
  };
  jwt.sign(user, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
  await db.query(queries.insertUser, [
    user.firstname, user.lastname, user.email, user.password, user.address, user.status, user.isadmin, user.createdon, user.updatedon,
  ]);

  // Create a loan of the registered user before testing other loans
  const createdon = new Date();
  const amount = 50000; // bring back loan amount of that specific loan; (work on this later)
  const interest = amount * 0.5;
  const tenor = 4;
  const balance = 0;
  const paymentinstallment = (amount + interest) / tenor; // bring back paymentinstallment of that specific loan; (work on this later)
  const remain = amount - balance; // remain = amount - balance; (work on this later)
  const repaid = 'false'; // compare the loan amount and the balance of that specific loan, if they are equal change repaid to true ; (work on this later)
  const approvedLoan = {
    useremail: 'client@gmail.com',
    tenor: 4,
    amount,
    status: 'approved',
    repaid,
    interest: 60000,
    paymentinstallment,
    balance,
    createdon,
    updatedon: new Date(),
  };
  const notApprovedLoan = {
    useremail: 'client@gmail.com',
    tenor: 4,
    amount,
    status: 'pending',
    repaid,
    interest: 60000,
    paymentinstallment,
    balance,
    createdon,
    updatedon: new Date(),
  };
  const approvedLoanvalues = [
    approvedLoan.useremail, approvedLoan.createdon, approvedLoan.status, approvedLoan.repaid, 
    approvedLoan.tenor, approvedLoan.amount, approvedLoan.paymentinstallment,
    approvedLoan.balance, approvedLoan.interest, approvedLoan.updatedon,
  ];
  const notApprovedLoanvalues = [
    notApprovedLoan.useremail, notApprovedLoan.createdon, notApprovedLoan.status, notApprovedLoan.repaid, 
    notApprovedLoan.tenor, notApprovedLoan.amount, notApprovedLoan.paymentinstallment,
    notApprovedLoan.balance, notApprovedLoan.interest, notApprovedLoan.updatedon,
  ];
  await db.query(queries.insertLoan, approvedLoanvalues);
  await db.query(queries.insertLoan, notApprovedLoanvalues);

  // Create a repayment of the registered loan before testing other repayment
  const paidamount = 5000;
  const repayment = {
    loanid: 1,
    monthlyInstallment: paymentinstallment,
    paidamount,
    repaid,
    balance: paidamount,
    remain,
    createdon: new Date(),
  };
  const repayValues = [
    repayment.loanid, repayment.monthlyInstallment, repayment.paidamount,
    repayment.repaid, repayment.balance, repayment.remain, repayment.createdon,
  ];
  await db.query(queries.insertRepayment, repayValues);
});
// after(async () => {
//   await dropTables();
// });

describe('User authentication Endpoints', () => {
  it('Should create an account', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(dummy.user2)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        // console.log(res.body);
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('Object');
        done();
      });
  });

  it('Should not create an account if user email already exists', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(dummy.user1)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(409);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not create an account if input are not validated', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(dummy.user3)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should be able to login', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send(dummy.authUser)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('Object');
        done();
      });
  });

  it('Should not login a user if email is incorrect', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send(dummy.falseUserEmail)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not login a user if password is incorrect', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send(dummy.falseUserPassword)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
