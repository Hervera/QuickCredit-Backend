import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app';
import dummy from './dummy';
import db from '../data/connection';
import queries from '../data/queries';
import { createTables, dropTables } from '../data/tables';

chai.should();
chai.use(chaiHttp);

dotenv.config();

describe('Repayment Endpoints', () => {
  let token;
  before(async () => {
    await dropTables();
    await createTables();
    const data = {
      firstname: 'admin',
      lastname: 'admin',
      email: 'admin@gmail.com',
      password: 'secret',
      address: 'Kigali',
      status: 'verified',
      isadmin: 'true',
      createdon: new Date(),
      updatedon: new Date(),
    };
    token = jwt.sign(data, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    await db.query(queries.insertUser, [
      data.firstname,
      data.lastname,
      data.email,
      data.password,
      data.address,
      data.status,
      data.isadmin,
      data.createdon,
      data.updatedon,
    ]);
  });

  after(async () => {
    await dropTables();
  });
  it('Should retrieve repayment history if a loan exists', (done) => {
    chai.request(server)
      .get('/api/v2/loans/2/repayments')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });

  it('Should not retrieve repayment history if a loan doesn\'t exist', (done) => {
    chai.request(server)
      .get('/api/v2/loans/500000/repayments')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not retrieve repayment history if a loanId is not specified', (done) => {
    chai.request(server)
      .get('/api/v2/loans/dsss/repayments')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should create a loan repayment record.', (done) => {
    chai.request(server)
      .post('/api/v2/loans/5/repayment')
      .send(dummy.paidamount)
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should not create a loan repayment record if a loan doesn\'t exist.', (done) => {
    chai.request(server)
      .post('/api/v2/loans/1000000000/repayment')
      .send(dummy.paidamount)
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not create a loan repayment record if a loan is not approved', (done) => {
    chai.request(server)
      .post('/api/v2/loans/54/repayment')
      .send(dummy.paidamount)
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not create a loan repayment record if a loan is not specified', (done) => {
    chai.request(server)
      .post('/api/v2/loans/xxxxx/repayment')
      .send(dummy.paidamount)
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
