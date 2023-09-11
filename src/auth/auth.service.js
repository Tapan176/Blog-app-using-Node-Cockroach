const cockroachLib = require('../../cockroach');
const bcrypt = require('bcrypt');
const helper = require('../utils/helper');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {
    selectUserByEmail,
    insertUser,
    updatePassword
} = require('./auth.dal');

dotenv.config();

module.exports = {
    login: async (email, password) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectUserByEmail, [email]);

            const passwordMatch = await bcrypt.compare(password, queryResult.rows[0].passwordHash);

            if (passwordMatch) {
                return queryResult.rows[0];
            } else {
                throw new Error('incorrect_password');
            }
        } finally {
            dbClient.release();
        }
    },
    signUp: async (firstName, lastName, email, password) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const existingUser = await dbClient.query(selectUserByEmail, [email]);

            if (existingUser.rowCount > 0) {
                throw new Error('user_already_exists');
            }
           
            const hashedPassword = await bcrypt.hash(password, 10);

            const queryResult = await dbClient.query(insertUser, [firstName, lastName, email, hashedPassword]);

            return queryResult;
            
        } finally {
            dbClient.release();
        }
    },
    forgotPassword: async (email) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
          const existingUser = await dbClient.query(selectUserByEmail, [email]);
      
          const resetToken = helper.generateToken({ email });

          const linkToSend = `http://localhost:${process.env.PORT}/resetPassword?token=${resetToken}`;
      
          await helper.sendEmail(email, linkToSend);

          return existingUser.rows[0];
        } finally {
            dbClient.release();
        }
    },
    resetPassword: async (token, newPassword) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);     

          const existingUser = await dbClient.query(selectUserByEmail, [decoded.email]);     

          const passwordMatch = await bcrypt.compare(newPassword, existingUser.rows[0].passwordHash);
      
          if (passwordMatch) {
            throw new Error('new_password_same_as_old_password');
          }
      
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          
          const queryResult = await dbClient.query(updatePassword, [hashedPassword, decoded.email]);
      
          return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
};
