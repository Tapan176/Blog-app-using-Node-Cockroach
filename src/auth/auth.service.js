const cockroachLib = require('../../cockroach');
const bcrypt = require('bcrypt');

module.exports = {
    login: async (email, password) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT "email", "passwordHash" FROM users WHERE "email" = '${email}'`);
            if (queryResult.rowCount > 0) {
                const passwordMatch = await bcrypt.compare(password, queryResult.rows[0].passwordHash);
                if (passwordMatch) {
                    return {message: "login successful", code: "login_successful"};
                } else {
                    return {message: "incorrect password", code: "incorrect_password"};
                }
            }
            else {
                return {message: "no user found", code:"no_user_found"};
            }
        } finally {
            dbClient.release();
        }
    },
    signUp: async (firstName, lastName, email, password, confirmPassword) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if (password === confirmPassword) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const queryResult = await dbClient.query(`INSERT INTO users ("firstName", "lastName", "email", "password") VALUES ('${firstName}', '${lastName}', '${email}', '${passwordHash}')`);
                return hashedPassword;
            }
        } finally {
            dbClient.release();
        }
    }
};