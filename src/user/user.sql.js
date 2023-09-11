module.exports = {
    selectAllUsers: 'SELECT * FROM users',

    selectUserById: 'SELECT * FROM users WHERE "id" = $1',

    selectUserByEmail: 'SELECT * FROM users WHERE "email" = $1',

    insertUser: 'INSERT INTO users ("firstName", "lastName", "email", "passwordHash", "isVerified", "role") VALUES ($1, $2, $3, $4, $5, $6)',

    updateUser: 'UPDATE users SET "firstName" = $1, "lastName" = $2, "email" = $3, "isVerified" = $4, "role" = $5 WHERE "id" = $6',

    deleteUserById: 'DELETE FROM users WHERE "id" = $1',

    updateUserPassword: 'UPDATE users SET "passwordHash" = $1, "updatedAt" = $2 WHERE "id" = $3',

    updateUserFullName: 'UPDATE users SET "firstName" = $1, "lastName" = $2, "updatedAt" = $3 WHERE "id" = $4',
};
