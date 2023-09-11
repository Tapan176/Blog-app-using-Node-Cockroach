const cockroachLib = require('../../cockroach');
const bcrypt = require('bcrypt');
const {
    selectAllUsers,
    selectUserById,
    selectUserByEmail,
    insertUser,
    updateUser,
    deleteUserById,
    updateUserPassword,
    updateUserFullName,
} = require('./user.sql');

module.exports = {
    getAllUserDetails: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectAllUsers);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserDetailsById: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectUserById, [userId]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserDetailsByEmail: async (userEmail) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectUserByEmail, [userEmail]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    createUser: async (firstName, lastName, email, password, confirmPassword, isVerified, role) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const existingUser = await dbClient.query(selectUserByEmail, [email]);

            if (existingUser.rowCount > 0) {
                throw new Error('user_already_exists');
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const queryResult = await dbClient.query(insertUser, [firstName, lastName, email, hashedPassword, isVerified, role]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    editUser: async (userId, firstName, lastName, email, isVerified, role) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(updateUser, [firstName, lastName, email, isVerified, role, userId]);                                             
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    deleteUser: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(deleteUserById, [userId]);                                                             
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    changePassword: async (userId, oldPassword, newPassword, confirmNewPassword) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const findUser = await dbClient.query(selectUserById, [userId]);

            const passwordMatch = await bcrypt.compare(oldPassword, findUser.rows[0].passwordHash);

            if (!passwordMatch) {
                throw new Error('incorrect_password');
            }

            if (oldPassword === newPassword) {
                throw new Error('new_password_same_as_old_password');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedAt = new Date().toISOString();

            const queryResult = await dbClient.query(updateUserPassword, [hashedPassword, updatedAt, userId]);

            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    changeName: async (userId, firstName, lastName) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const updatedAt = new Date().toISOString();

            const queryResult = await dbClient.query(updateUserFullName, [firstName, lastName, updatedAt, userId]);
            
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
};