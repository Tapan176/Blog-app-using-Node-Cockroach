const cockroachLib = require('../../cockroach');

module.exports = {
    getAllUserDetails: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query('SELECT * FROM users');
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserDetailsById: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM users WHERE "id" = ${userId}`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserDetailsByEmail: async (userEmail) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM users WHERE "email" = '${userEmail}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    createUser: async (firstName, lastName, email, password, confirmPassword, isVerified, role) => {
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
                const queryResult = await dbClient.query(`INSERT INTO users ("firstName", "lastName", "email", "passwordHash", "isVerified", "role") 
                                                                      VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${isVerified}', '${role}')`);
                return queryResult.rows;
            }
        } finally {
            dbClient.release();
        }
    },
    editUser: async (userId, firstName, lastName, email, isVerified, role) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`UPDATE users SET "firstName" = '${firstName}', 
                                                                        "lastName" = '${lastName}', 
                                                                        "email" = '${email}',
                                                                        "isVerified" = '${isVerified}', 
                                                                        "role" = '${role}' WHERE "id" = '${userId}'`);
                                                                        
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    deleteUser: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`DELETE FROM users WHERE "id" = '${userId}'`);                                                             
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
};