import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app';
import dummy from './dummy';
import db from '../data/connection';
import queries from '../data/queries';
import { createTables, dropTables } from '../data/tables';

dotenv.config();

chai.should();
chai.use(chaiHttp);

describe('User authentication Endpoints', () => {
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
    const token = jwt.sign(data, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
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

  it('Should create an account', (done) => {
    const data2 = {
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
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(data2)
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

  it('Should not create an account if input are not validated', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send(dummy.user1)
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
      .send(dummy.adminUser)
      .set('Accept', 'Application/JSON')
      .end((err, res) => {
        res.body.should.be.an('Object');
        res.body.should.have.property('status').equal(409);
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
