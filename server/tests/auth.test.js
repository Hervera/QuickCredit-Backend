import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

import {
  user1, registeredUser, newUser, authUser, falseUserEmail, falseUserPassword,
} from './dummy';

chai.should();
chai.use(chaiHttp);

describe('User authentication Endpoints', () => {
  it('Should not create an account if input are not validated', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(user1)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not create an account if user email already exists', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(registeredUser)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(409);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should create an account', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(newUser)
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
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send(authUser)
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
      .send(falseUserEmail)
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
      .send(falseUserPassword)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
