const cockroachLib = require('../cockroach');
const bcrypt = require('bcrypt');
const helper = require('../utils/helper');
const jwt = require('jsonwebtoken');
const dal = require('./auth.dal');

module.exports = {
    login: async (email, password) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            const queryResult = await dal.selectUserByEmail(dbClient, {email: email});

            const passwordMatch = await bcrypt.compare(password, queryResult.rows[0].passwordHash);

            if (!passwordMatch) {
                throw new Error('incorrect_password');
            }

            return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
    signup: async (firstName, lastName, email, password) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            const existingUser = await dal.selectUserByEmail(dbClient, {email: email});

            if (existingUser.rowCount > 0) {
                throw new Error('user_already_exists');
            }
           
            const hashedPassword = await bcrypt.hash(password, 10);

            const queryResult = await dal.insertUser(dbClient, {firstName: firstName, lastName: lastName, email: email, hashedPassword: hashedPassword});

            return queryResult;
            
        } finally {
            dbClient.release();
        }
    },
    forgotPassword: async (email) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
          const existingUser = await dal.selectUserByEmail(dbClient, {email: email});
      
          const resetToken = helper.generateToken({ email });

          const linkToSend = `${process.env.RESET_PASSWORD_LINK}/resetPassword?token=${resetToken}`;
      
          await helper.sendEmail(email, linkToSend);

          return existingUser.rows[0];
        } finally {
            dbClient.release();
        }
    },
    resetPassword: async (token, newPassword) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);     

          const existingUser = await dal.selectUserByEmail(dbClient, {email: email});     

          const passwordMatch = await bcrypt.compare(newPassword, existingUser.rows[0].passwordHash);
      
          if (passwordMatch) {
            throw new Error('new_password_same_as_old_password');
          }
      
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          
          const queryResult = await dal.updatePassword(dbClient, {hashedPassword: hashedPassword, email: decoded.email});
      
          return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
};
