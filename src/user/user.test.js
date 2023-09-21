// process.env.NODE_ENV = 'test';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../../app');

// chai.use(chaiHttp);

// const { expect } = chai;

// describe('Profile API Tests', () => {
//   let sessionCookie;

//   before((done) => {
//     chai.request(app)
//       .post('/login')
//       .send({ email: 'ktapan176@gmail.com', password: 'Tapan@12' })
//       .end((err, res) => {
//         const cookies = res.headers['set-cookie'].map((cookie) => cookie.split(';')[0]);
//         sessionCookie = cookies.join('; ');
//         done();
//       });
//   });

//   describe('PUT /profile/changePassword', () => {
//     it('should update the user password', (done) => {
//       chai.request(app)
//         .put('/profile/changePassword')
//         .set('Cookie', sessionCookie)
//         .send({ oldPassword: 'Tapan@12', newPassword: 'newPassword', confirmNewPassword: 'newPassword' })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.be.an('object');
//           expect(res.body).to.have.property('password').to.not.equal('oldPassword');
//           done();
//         });
//     });
//   });

//   describe('PUT /profile/changeNameAndAddress', () => {
//     it('should update the user name and address', (done) => {
//       chai.request(app)
//         .put('/profile/changeNameAndAddress')
//         .set('Cookie', sessionCookie)
//         .send({ name: 'A', address: '123' })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.be.an('object');
//           expect(res.body).to.have.property('name').to.equal('A');
//           expect(res.body).to.have.property('address').to.equal('123');
//           done();
//         });
//     });
//   });

//   describe('POST /profile/changeEmail', () => {
//     it('should change the user email', (done) => {
//       chai.request(app)
//         .post('/profile/changeEmail')
//         .set('Cookie', sessionCookie)
//         .send({ newEmail: 'tapankhokhariya176@gmail.com' })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('code', 'email_updated');
//           expect(res.body).to.have.property('message').to.be.a('string');
//           done();
//         });
//     });
//   });

//   describe('POST /profile/userEmail/verify', () => {
//     it('should send email verification link to the user', (done) => {
//       chai.request(app)
//         .post('/profile/userEmail/verify')
//         .set('Cookie', sessionCookie)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('code', 'verify_your_email');
//           expect(res.body).to.have.property('message').to.be.a('string');
//           done();
//         });
//     });
//   });

//   describe('PUT /profile/newEmail/verify', () => {
//     it('should verify the user email', (done) => {
//       const verificationToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt0YXBhbjE3NkBnbWFpbC5jb20iLCJpYXQiOjE2ODc4NTU2NTQsImV4cCI6MTY4Nzg1OTI1NH0.X6GHDK6koi1b0Sv4KqqyMnM_NycAZDPiMoj3Fq_c_nU';
//       chai.request(app)
//         .put(`/profile/newEmail/verify?token=${verificationToken}`)
//         .set('Cookie', sessionCookie)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('code', 'email_verified');
//           expect(res.body).to.have.property('message').to.be.a('string');
//           done();
//         });
//     });
//   });

// });
