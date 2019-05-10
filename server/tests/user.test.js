/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.should();
chai.use(chaiHttp);

describe('User Endpoints', () => {
  it('Should retrieve all users', (done) => {
    chai.request(server)
      .get('/api/users')
      .set('Accept', 'Application/JSON')
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
      .get('/api/users/1')
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });
});
