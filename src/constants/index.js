const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('../middleware/error');

const userRoutes = require('../user/user.route');
const authRoutes = require('../auth/auth.route');
const blogRoutes = require('../blog/blog.route');

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
    maxAge: 60 * 1000,
    httpOnly: true,
  },
}));

app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);
app.use(blogRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}!`);
});