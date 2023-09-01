const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('../middleware/error');

const routes = require('../indexRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRETKEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
  },
}));

app.use(express.json());

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}!`);
});