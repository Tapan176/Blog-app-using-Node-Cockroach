module.exports = {
    insertUser: async (dbClient, userData) => {
      const sqlStmt = `
        INSERT INTO "users"
          (
            "firstName"
            ,"lastName"
            ,"email"
            ,"passwordHash"
          )
        VALUES
          (
            $1
            ,$2
            ,$3
            ,$4
          );`;
      const parameters = [userData.firstName, userData.lastName, userData.email, userData.passwordHash];
      const queryResult = await dbClient.query(sqlStmt, parameters);
      return queryResult.rows;
    },
    selectUserByEmail: 'SELECT * FROM users WHERE email = $1',

    insertUser: '',
    
    updatePassword: 'UPDATE users SET "passwordHash" = $1 WHERE "email" = $2',
};