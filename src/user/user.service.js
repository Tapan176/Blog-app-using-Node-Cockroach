const bcrypt = require('bcrypt');
const cockroachLib = require('../cockroach');
const dal = require('./user.dal');

module.exports = {
  getAllUserDetails: async () => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectAllUsers(dbClient);
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  getUserDetailsById: async (userId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectUserById(dbClient, { userId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  getUserDetailsByEmail: async (userEmail) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectUserByEmail(dbClient, { userEmail });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  createUser: async (firstName, lastName, email, password, isVerified, role) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const existingUser = await dal.selectUserByEmail(dbClient, { email });

      if (existingUser.rowCount > 0) {
        throw new Error('user_already_exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const queryResult = await dal
        .insertUser(
          dbClient,
          {
            firstName,
            lastName,
            email,
            hashedPassword,
            isVerified,
            role,
          },
        );
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  editUser: async (userId, firstName, lastName, email, isVerified, role) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal
        .updateUser(
          dbClient,
          {
            firstName,
            lastName,
            email,
            isVerified,
            role,
            userId,
          },
        );
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  deleteUser: async (userId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.deleteUserById(dbClient, { userId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  changePassword: async (userId, oldPassword, newPassword) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const findUser = await dal.selectUserById(dbClient, { userId });

      const passwordMatch = await bcrypt.compare(oldPassword, findUser.rows[0].passwordHash);

      if (!passwordMatch) {
        throw new Error('incorrect_password');
      }

      if (oldPassword === newPassword) {
        throw new Error('new_password_same_as_old_password');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedAt = new Date().toISOString();

      const queryResult = await dal
        .updateUserPassword(
          dbClient,
          {
            hashedPassword,
            updatedAt,
            userId,
          },
        );

      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  changeName: async (userId, firstName, lastName) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const updatedAt = new Date().toISOString();

      const queryResult = await dal
        .updateUserFullName(
          dbClient,
          {
            firstName,
            lastName,
            updatedAt,
            userId,
          },
        );

      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
};
