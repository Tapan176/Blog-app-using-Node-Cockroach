const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cockroachLib = require('../cockroach');
const helper = require('../utils/helper');
const dal = require('./auth.dal');

class Service {
  async login (email, password) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectUserByEmail(dbClient, { email });

      const passwordMatch = await bcrypt.compare(password, queryResult.rows[0].passwordHash);

      if (!passwordMatch) {
        throw new Error('incorrect_password');
      }

      return queryResult.rows[0];
    } finally {
      dbClient.release();
    }
  }

  async signup (firstName, lastName, email, password) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const existingUser = await dal.selectUserByEmail(dbClient, { email });

      if (existingUser.rowCount > 0) {
        throw new Error('user_already_exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const queryResult = await dal.insertUser(dbClient, {
        firstName, lastName, email, hashedPassword,
      });

      return queryResult;
    } finally {
      dbClient.release();
    }
  }

  async forgotPassword (email) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const existingUser = await dal.selectUserByEmail(dbClient, { email });

      const resetToken = helper.generateToken({ email });

      const emailBody = `${process.env.RESET_PASSWORD_LINK}/resetPassword?token=${resetToken}`;
      const emailSubject = 'Reset Password Link';
      await helper.sendEmail(email, emailSubject, emailBody);

      return existingUser.rows[0];
    } finally {
      dbClient.release();
    }
  }

  async resetPassword (token, newPassword) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const existingUser = await dal.selectUserByEmail(dbClient, { email: decoded.email });

      const passwordMatch = await bcrypt.compare(newPassword, existingUser.rows[0].passwordHash);

      if (passwordMatch) {
        throw new Error('new_password_same_as_old_password');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const queryResult = await dal.updatePassword(
        dbClient,
        { hashedPassword, email: decoded.email },
      );

      return queryResult.rows[0];
    } finally {
      dbClient.release();
    }
  }
}

module.exports = new Service();
