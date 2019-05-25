import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../app';
import dummy from './dummy';

chai.should();
chai.use(chaiHttp);

dotenv.config();

describe('Repayment Endpoints', () => {
  let authToken;
  before((done) => {
    chai.request(server).post('/api/v2/auth/signin')
      .send(dummy.authUser)
      .end((err, res) => {
        authToken = res.body.data.token; // save the token
        done();
      });
  });

  it('Should retrieve repayment history if a loan exists', (done) => {
    chai.request(server)
      .get('/api/v2/loans/1/repayments')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
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
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not retrieve repayment history if a loanid is not specified', (done) => {
    chai.request(server)
      .get('/api/v2/loans/dsss/repayments')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should create a loan repayment record.', (done) => {
    chai.request(server)
      .post('/api/v2/loans/1/repayment')
      .send(dummy.paidamount)
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
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
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not create a loan repayment record if a loan is not approved', (done) => {
    chai.request(server)
      .post('/api/v2/loans/2/repayment')
      .send(dummy.paidamount)
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
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
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
