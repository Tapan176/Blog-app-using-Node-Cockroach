const cockroachLib = require('../../cockroach');

module.exports = {
    getAllUserDetails: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query('SELECT * FROM users');
            return (queryResult.rows);
        } finally {
            dbClient.release();
        }
    },
    getUserDetailsById: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM users WHERE "id" = ${userId}`);
            return (queryResult.rows);
        } finally {
            dbClient.release();
        }
    },
    getUserDetailsByEmail: async (userEmail) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM users WHERE "email" = '${userEmail}'`);
            return (queryResult.rows);
        } finally {
            dbClient.release();
        }
    },
};