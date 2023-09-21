/* eslint-disable no-console */
const sinon = require('sinon');

const sendEmailMock = sinon.stub().callsFake(async (email, linkToSend, next) => {
  try {
    console.log('Email sent:', email, linkToSend);
    return { code: 'email_sent_successfully', message: 'Email sent successfully' };
  } catch (error) {
    next(error);
  }
});

module.exports = {
  sendEmailMock,
};
