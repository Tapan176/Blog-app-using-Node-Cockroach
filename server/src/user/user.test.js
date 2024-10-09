/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const { expect } = chai;

chai.use(chaiHttp);

describe('User API Endpoints', () => {
  let sessionCookie;

  before(async () => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password@123',
      })
      .end((err, res) => {
        const cookies = res.headers['set-cookie'].map(
          (cookie) => cookie.split(';')[0],
        );
        sessionCookie = cookies.join('; ');
        done();
      });
  });

  describe('GET /user/users', () => {
    it('should return a list of users', (done) => {
      chai
        .request(app)
        .get('/user/users')
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');

          done();
        });
    });
  });

  describe('POST /user/users', () => {
    it('should create a new user', (done) => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      chai
        .request(app)
        .post('/user/users')
        .set('Cookie', sessionCookie)
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(201);

          done();
        });
    });
  });

  describe('GET /user/users/email', () => {
    it('should get user by email', (done) => {
      const userEmail = 'user@example.com';

      chai
        .request(app)
        .get(`/user/users/email?userEmail=${userEmail}`)
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(200);

          done();
        });
    });
  });

  describe('GET /user/users/:id', () => {
    it('should get user by ID', (done) => {
      const userId = 123;

      chai
        .request(app)
        .get(`/user/users/${userId}`)
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(200);

          done();
        });
    });
  });

  describe('PUT /user/users/:id', () => {
    it('should update user by ID', (done) => {
      const userId = 123;
      const updatedUserData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        isVerified: 'false',
        role: 'user',
      };

      chai
        .request(app)
        .put(`/user/users/${userId}`)
        .set('Cookie', sessionCookie)
        .send(updatedUserData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('DELETE /user/users/:id', () => {
    it('should delete user by ID', (done) => {
      const userId = 123;

      chai
        .request(app)
        .delete(`/user/users/${userId}`)
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('PUT /user/users/change-password', () => {
  it('should change user password', (done) => {
    const newPasswordData = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    chai
      .request(app)
      .put('/user/users/change-password')
      .set('Cookie', sessionCookie)
      .send(newPasswordData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('PUT /user/users/change-name', () => {
  it('should change user name', (done) => {
    const newNameData = {
      firstName: 'NewFirstName',
      lastName: 'NewLastName',
    };

    chai
      .request(app)
      .put('/user/users/change-name')
      .set('Cookie', sessionCookie)
      .send(newNameData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
