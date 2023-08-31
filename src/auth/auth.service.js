const cockroachLib = require('../../cockroach');
const bcrypt = require('bcrypt');

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
};