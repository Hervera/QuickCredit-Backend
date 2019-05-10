/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.should();
chai.use(chaiHttp);

describe('Loan Endpoints', () => {
  it('Should retrieve all loans', (done) => {
    chai.request(server)
      .get('/api/loans')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });

  it('Should retrieve a specific loan', (done) => {
    chai.request(server)
      .get('/api/loans/2')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should create a loan', (done) => {
    const loan = {
      user: 'hervera@gmail.com',
      tenor: 4,
      amount: 550000,
    };
    chai.request(server)
      .post('/api/loans')
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
});
