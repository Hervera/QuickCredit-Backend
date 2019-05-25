import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import dummy from './dummy';

chai.should();
chai.use(chaiHttp);

describe('User Endpoints', () => {
  let authToken;
  before((done) => {
    chai.request(server).post('/api/v2/auth/signin')
      .send(dummy.authUser)
      .end((err, res) => {
        authToken = res.body.data.token; // save the token
        done();
      });
  });

  it('Should retrieve all users', (done) => {
    chai.request(server)
      .get('/api/v2/users')
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

  it('Should retrieve a specific user/client', (done) => {
    chai.request(server)
      .get('/api/v2/users/1')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should not retrieve a specific user/client if user is not found', (done) => {
    chai.request(server)
      .get('/api/v2/users/50000')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not retrieve a specific user/client if the userId is not specified', (done) => {
    chai.request(server)
      .get('/api/v2/users/dsss')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should verify a user if email of the user is found', (done) => {
    chai.request(server)
      .patch('/api/v2/users/admin@gmail.com/verify')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should not verify a user if email is not found', (done) => {
    chai.request(server)
      .patch('/api/v2/users/xxxxx@gmail.com/verify')
      .set('Accept', 'Application/JSON')
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not verify a user if email is not specified', (done) => {
    chai.request(server)
      .patch('/api/v2/users/xxxxx/verify')
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
