module.exports = {
    selectUserByEmail: 'SELECT * FROM users WHERE email = $1',

    insertUser: 'INSERT INTO users ("firstName", "lastName", "email", "passwordHash") VALUES ($1, $2, $3, $4)',
    
    updatePassword: 'UPDATE users SET "passwordHash" = $1 WHERE "email" = $2',
};