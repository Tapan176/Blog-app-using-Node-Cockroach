/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentication API Tests', () => {
  let sessionCookie;

  before((done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'mayur12@gmail.com', password: 'mayur@12' })
      .end((err, res) => {
        const cookies = res.headers['set-cookie'].map((cookie) => cookie.split(';')[0]);
        sessionCookie = cookies.join('; ');
        done();
      });
  });

  describe('POST /signup', () => {
    it('should return status 201 and create a new user', (done) => {
      chai.request(app)
        .post('/signup')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.empty;

          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should return status 204 and set a session cookie', (done) => {
      chai.request(app)
        .post('/login')
        .send({ email: 'mayur12@gmail.com', password: 'mayur@12' })
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(res).to.have.cookie('connect.sid');
          expect(res.body).to.be.empty;

          done();
        });
    });
  });

  describe('POST /logout', () => {
    it('should return status 204 and clear the session cookie', (done) => {
      chai.request(app)
        .post('/logout')
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(204);
          expect(res).to.not.have.cookie('connect.sid');
          expect(res.body).to.be.empty;

          done();
        });
    });
  });

  describe('POST /forgotPassword', () => {
    it('should return status 200 and send a reset token', (done) => {
      chai.request(app)
        .post('/forgotPassword')
        .send({ email: 'ktapan176@gmail.com' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('code', 'reset_token_sent_successfully');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          done();
        });
    });
  });

  describe('POST /resetPassword', () => {
    it('should return status 200 and reset the password', (done) => {
      chai.request(app)
        .post('/resetPassword?token=')
        .send({ newPassword: 'Mayur@12', confirmPassword: 'Mayur@12' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('code', 'password_reset_successful');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          done();
        });
    });
  });
});
