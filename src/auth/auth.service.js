const cockroachLib = require('../../cockroach');
const bcrypt = require('bcrypt');
const helper = require('../utils/helper');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    login: async (email, password) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM users WHERE "email" = '${email}'`);
            if (queryResult.rowCount > 0) {
                const passwordMatch = await bcrypt.compare(password, queryResult.rows[0].passwordHash);
                if (passwordMatch) {
                    return queryResult.rows[0];
                } else {
                    throw new Error('incorrect_password');
                }
            }
            else {
                throw new Error('user_not_found');
            }
        } finally {
            dbClient.release();
        }
    },
    signUp: async (firstName, lastName, email, password, confirmPassword) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const existingUser = await dbClient.query(`SELECT * FROM users WHERE email = '${email}'`);
            if (existingUser.rowCount > 0) {
                throw new Error('user_already_exists');
            }
            if (password !== confirmPassword) {
                throw new Error('password_and_confirm_password_do_not_match');
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const queryResult = await dbClient.query(`INSERT INTO users ("firstName", "lastName", "email", "passwordHash") 
                                                                      VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`);
                return queryResult;
            }
        } finally {
            dbClient.release();
        }
    },
    forgotPassword: async (email) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
          const existingUser = await dbClient.query(`SELECT * FROM users WHERE email = '${email}'`);
      
          if (existingUser.rowCount == 0) {
            throw new Error('user_not_found');
          }
      
          const resetToken = helper.generateToken({ email });
          const linkToSend = `http://localhost:${process.env.PORT}/resetPassword?token=${resetToken}`;
      
          await helper.sendEmail(email, linkToSend);

          return existingUser.rows[0];
        } finally {
            dbClient.release();
        }
    },
    resetPassword: async (token, newPassword, confirmPassword) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          const existingUser = await dbClient.query(`SELECT * FROM users WHERE email = '${decoded.email}'`);
          if (existingUser.rowCount == 0) {
            throw new Error('user_not_found');
          }
      
          if (newPassword !== confirmPassword) {
            throw new Error('password_and_confirm_password_do_not_match');
          }
      
          const passwordMatch = await bcrypt.compare(newPassword, existingUser.rows[0].passwordHash);
      
          if (passwordMatch) {
            throw new Error('new_password_same_as_old_password');
          }
      
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          
          const queryResult = await dbClient.query(`UPDATE users SET "passwordHash" = '${hashedPassword}' WHERE "email" = '${decoded.email}'`);
      
          return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
};