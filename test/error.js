/* eslint-disable no-undef */
const { expect } = require('chai');
const { ValidationError } = require('express-validation');
const sinon = require('sinon');
const { errorHandler } = require('../src/middleware/error');

describe('errorHandler middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: () => res,
      json: () => res,
    };
    next = () => {};
  });

  it('should return validation error response if the error is an instance of ValidationError', () => {
    const validationError = new ValidationError('Validation error', { statusCode: 400 });

    const statusStub = sinon.stub(res, 'status').returns(res);
    const jsonStub = sinon.stub(res, 'json').returns(res);

    errorHandler(validationError, req, res, next);

    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledWith(validationError)).to.be.true;

    statusStub.restore();
    jsonStub.restore();
  });

  it('should return error response based on the error code and status code', () => {
    const error = {
      code: 'user_not_found',
      message: 'User not found',
      statusCode: 404,
    };

    const statusStub = sinon.stub(res, 'status').returns(res);
    const jsonStub = sinon.stub(res, 'json').returns(res);

    errorHandler(error, req, res, next);

    expect(statusStub.calledWith(404)).to.be.true;
    expect(jsonStub.calledWith({
      error: {
        code: 'user_not_found',
        message: 'User not found',
      },
    })).to.be.true;

    statusStub.restore();
    jsonStub.restore();
  });
});
