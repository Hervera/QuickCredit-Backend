/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.should();
chai.use(chaiHttp);

describe('Repayment Endpoints', () => {
  it('Should retrieve repayment history', (done) => {
    chai.request(server)
      .get('/api/loans/2/repayments')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });

  it('Should Create a loan repayment record.', (done) => {
    const loan = {
      paidAmount: 5000000,
    };
    chai.request(server)
      .post('/api/loans/5/repayment')
      .send(loan)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should not create a loan repayment record if a loan is not approved or doen\'t exist.', (done) => {
    const loan = {
      paidAmount: 5000000,
    };
    chai.request(server)
      .post('/api/loans/1/repayment')
      .send(loan)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });
});
