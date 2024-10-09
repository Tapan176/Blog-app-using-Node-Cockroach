const dotenvResult = require('dotenv-safe').config({ path: './.config/.env', allowEmptyValues: true });
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { errorHandler } = require('./src/middleware/error');

const routes = require('./src/indexRoute');

if (dotenvResult.error) {
  throw dotenvResult.error;
}

const app = express();
const { PORT } = process.env;

// Enable CORS
app.use(cors());

app.use(cookieParser());
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRETKEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  },
}));

app.use(express.json());

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${PORT}!`);
});

module.exports = app;
