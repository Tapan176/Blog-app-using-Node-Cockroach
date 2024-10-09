const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../src/utils/helper');
const { authenticate, verifyJwtToken } = require('../src/middleware/passport');

describe('authenticate user middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      session: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });

  it('should call next middleware if user exists in session', () => {
    req.session.user = {
      id: '6489b58e7ea61d2d2679badc', email: 'ktapan176@gmail.com', name: 'A', role: 'user',
    };

    authenticate(req, res, next);

    expect(next.called).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
  });

  it('should send 401 status and error message if user does not exist in session', () => {
    authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ code: 'unauthorized', message: 'Unauthorized access' })).to.be.true;
  });
});

describe('authenticate admin middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      session: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });

  it('should call next middleware if user exists in session', () => {
    req.session.user = {
      id: '6489b58e7ea61d2d2679badc', email: 'ktapan176@gmail.com', name: 'A', role: 'admin',
    };

    authenticate(req, res, next);

    expect(next.called).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
  });

  it('should send 401 status and error message if user does not exist in session', () => {
    authenticate(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ code: 'unauthorized', message: 'Unauthorized access' })).to.be.true;
  });
});

describe('verifyJwtToken middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {};
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call next middleware if the token is valid', () => {
    const token = 'valid_token';
    req.query.token = token;

    const verifyStub = sinon.stub(jwt, 'verify').returns({});

    verifyJwtToken(req, res, next);

    expect(verifyStub.calledOnceWith(token, process.env.JWT_SECRET)).to.be.true;
    expect(next.calledOnce).to.be.true;

    verifyStub.restore();
  });

  it('should throw an error if the token is invalid', () => {
    const token = 'invalid_token';
    req.query.token = token;

    const verifyStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    verifyJwtToken(req, res, next);

    expect(verifyStub.calledOnceWith(token, process.env.JWT_SECRET)).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.an.instanceOf(Error);
    expect(next.firstCall.args[0].message).to.equal('Invalid token');

    verifyStub.restore();
  });
});

describe('generateToken', () => {
  it('should generate a valid JWT token', () => {
    const payload = { email: 'ktapan176@gmail.com' };

    const token = generateToken(payload);
    expect(token).to.be.a('string');
    expect(token).to.not.be.empty;
  });

  it('should include the payload in the generated token', () => {
    const payload = { email: 'ktapan176@gmail.com' };
    const secret = 'tapan';

    const token = generateToken(payload, secret);

    const decoded = jwt.verify(token, secret);
    expect(decoded.email).to.deep.equal(payload.email);
  });
});
