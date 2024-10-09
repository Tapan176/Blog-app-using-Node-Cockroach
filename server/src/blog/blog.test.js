/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../../app');

chai.use(chaiHttp);
const { expect } = chai;
let sessionCookie;

before((done) => {
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

describe('POST /blog/blogs', () => {
  it('should create a new blog and return status 201', (done) => {
    const request = chai.request(app).post('/blog/blogs');
    request.set('Cookie', sessionCookie);
    request.field('title', 'Test Blog');
    request.field('description', 'This is a test blog');
    request.attach('images', fs.readFileSync('images/cpp.png'), 'image1.jpg');

    request.end((err, res) => {
      expect(res).to.have.status(201);
      done();
    });
  });
});

describe('GET /blog/blogs/myBlogs', () => {
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

  it('should return all blogs created by the user', (done) => {
    chai
      .request(app)
      .get('/blog/blogs/myBlogs')
      .set('Cookie', sessionCookie)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('GET /blog/blogs', () => {
  it('should return all blogs sorted by created date', (done) => {
    chai
      .request(app)
      .get('/blog/blogs')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('GET /blog/blogs/:blogId', () => {
  it('should return status 200 for an existing blog', (done) => {
    const validBlogId = '649e94ea08fd6848abd4a605';

    chai
      .request(app)
      .get(`/blog//blogs/${validBlogId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          try {
            expect(res).to.have.status(200);
            done();
          } catch (error) {
            done(error);
          }
        }
      });
  });
});

describe('GET /blog/blogs/searchBlogs', () => {
  it('should return blogs matching the provided keyword', (done) => {
    const keyword = 'test';

    chai
      .request(app)
      .get(`/blogs/search?keyword=${keyword}`)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('PUT /blog/blogs/:blogId', () => {
  before((done) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'prunthil@gmail.com',
        password: 'Prunthil@123',
      })
      .end((err, res) => {
        const cookies = res.headers['set-cookie'].map(
          (cookie) => cookie.split(';')[0],
        );
        sessionCookie = cookies.join('; ');
        done();
      });
  });

  it('should update a specific blog and return status 200', (done) => {
    const blogId = '649e94ea08fd6848abd4a605';
    const updatedBlog = {
      title: 'Updated blog',
      description: 'Well this is done from the test cases',
    };

    chai
      .request(app)
      .put(`/blog/blogs/${blogId}`)
      .set('Cookie', sessionCookie)
      .send(updatedBlog)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          try {
            expect(res).to.have.status(200);
            expect(res).to.not.have.cookie('connect.sid');
            expect(res.body).to.be.empty;
            done();
          } catch (error) {
            done(error);
          }
        }
      });
  });
});

describe('DELETE /blog/blogs/:blogId', () => {
  before((done) => {
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

  it('should delete a specific blog and return status 200', (done) => {
    const blogId = '649e95bcc100a88ac46fb27e';
    chai
      .request(app)
      .delete(`/blog/blogs/${blogId}`)
      .set('Cookie', sessionCookie)
      .end((err, res) => {
        try {
          expect(res).to.have.status(200);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
