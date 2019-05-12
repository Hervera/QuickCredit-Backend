/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.should();
chai.use(chaiHttp);

describe('User authentication Endpoints', () => {
  it('Should not create an account if input are not validated', (done) => {
    const user = {
      firstName: '445',
      lastName: '',
      email: 'hervera12@gmail.com',
      password: 'secret',
      address: 'Kigali, Gasabo',
    };
    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not create an account if user emailalready exists', (done) => {
    const user = {
      firstName: 'nkuli',
      lastName: 'hervera',
      email: 'hervera@gmail.com',
      password: 'secret',
      address: 'Kigali, Gasabo',
    };
    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should create an account', (done) => {
    const user = {
      firstName: 'Herve',
      lastName: 'Nkuri',
      email: 'hervera12@gmail.com',
      password: 'secret',
      address: 'Kigali, Gasabo',
    };
    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('Object');
        done();
      });
  });

  it('Should be able to login', (done) => {
    const login = {
      email: 'hervera@gmail.com',
      password: 'secret',
    };
    chai.request(server)
      .post('/api/auth/signin')
      .send(login)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('Object');
        done();
      });
  });

  it('Should not login a user if email is incorrect', (done) => {
    const login = {
      email: 'xxxxxxx@gmail.com',
      password: 'secret',
    };
    chai.request(server)
      .post('/api/auth/signin')
      .send(login)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not login a user if password is incorrect', (done) => {
    const login = {
      email: 'hervera@gmail.com',
      password: 'xxxxxxxx',
    };
    chai.request(server)
      .post('/api/auth/signin')
      .send(login)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
