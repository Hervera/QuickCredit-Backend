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

  it('Should not retrieve a specific loan if a loan doesn\'t exist', (done) => {
    chai.request(server)
      .get('/api/loans/0')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not retrieve a specific loan if a loanId is not specified', (done) => {
    chai.request(server)
      .get('/api/loans/dsss')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
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

  it('Should create a loan if user with this email doesn\'t exist', (done) => {
    const loan = {
      user: 'xxxxxxxx@gmail.com',
      tenor: 4,
      amount: 550000,
    };
    chai.request(server)
      .post('/api/loans')
      .send(loan)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should create a loan if email is not specified in url params', (done) => {
    const loan = {
      user: 'xxxxxxxx',
      tenor: 4,
      amount: 550000,
    };
    chai.request(server)
      .post('/api/loans')
      .send(loan)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should approve or reject a specific loan', (done) => {
    chai.request(server)
      .put('/api/loans/2')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should not approve or reject a specific a loan if it is not found', (done) => {
    chai.request(server)
      .put('/api/loans/0')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not retrieve approve or reject a loan if the loanId is not specified', (done) => {
    chai.request(server)
      .put('/api/loans/dsss')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
