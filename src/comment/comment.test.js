/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Comment', () => {
  let sessionCookie;

  before((done) => {
    chai
      .request(app)
      .post('/login')
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

  describe('addComment', () => {
    it('should add a new comment and return status 201', (done) => {
      const blogId = '649e820e0d09e6df037b96a2';

      chai
        .request(app)
        .post(`/blogs/${blogId}/comments`)
        .send({ comment: 'This is a new comment from test cases' })
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment and return status 200', (done) => {
      const commentId = '649ea322897eb772f6856f04';

      chai
        .request(app)
        .put(`/comments/${commentId}`)
        .send({ comment: 'This is an updated comment from the test cases' })
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.not.have.cookie('connect.sid');
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  describe('deleteComment', () => {
    it('should delete an existing comment and return status 200', (done) => {
      const commentId = '649ea322897eb772f6856f04';
      const blogId = '649e820e0d09e6df037b96a2';

      chai
        .request(app)
        .delete(`/blogs/${blogId}/comments/${commentId}`)
        .set('Cookie', sessionCookie)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
