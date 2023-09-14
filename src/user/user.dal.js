module.exports = {
  selectAllUsers: async (dbClient) => {
    const sqlStmt = `
      SELECT * 
      FROM users
      ;`;
    const queryResult = await dbClient.query(sqlStmt);
    return queryResult;
  },
  selectUserById: async (dbClient, userData) => {
    const sqlStmt = `
      SELECT * 
      FROM users 
      WHERE "id" = $1
      ;`;
    const parameters = [userData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  selectUserByEmail: async (dbClient, userData) => {
    const sqlStmt = `
      SELECT * 
      FROM "users" 
      WHERE "email" = $1
      ;`;
    const parameters = [userData.email];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  insertUser: async (dbClient, userData) => {
    const sqlStmt = `
      INSERT INTO "users"
        (
          "firstName"
          ,"lastName"
          ,"email"
          ,"passwordHash"
          ,"isVerified"
          ,"role"
        ) 
      VALUES 
        (
          $1
          ,$2
          ,$3
          ,$4
          ,$5
          ,$6
        );`;
    const parameters = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.passwordHash,
      userData.isVerified,
      userData.role,
    ];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateUser: async (dbClient, userData) => {
    const sqlStmt = `
      UPDATE "users" 
      SET 
        "firstName" = $1
        ,"lastName" = $2
        ,"email" = $3
        ,"isVerified" = $4
        ,"role" = $5 
      WHERE "id" = $6
      ;`;
    const parameters = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.passwordHash,
      userData.isVerified,
      userData.role,
    ];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  deleteUserById: async (dbClient, userData) => {
    const sqlStmt = `
      DELETE FROM "users"
      WHERE "id" = $1
      ;`;
    const parameters = [userData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateUserPassword: async (dbClient, userData) => {
    const sqlStmt = `
      UPDATE users 
      SET 
        "passwordHash" = $1
        ,"updatedAt" = $2
      WHERE "id" = $3
      ;`;
    const parameters = [
      userData.passwordHash,
      userData.updatedAt,
      userData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateUserFullName: async (dbClient, userData) => {
    const sqlStmt = `
      UPDATE users 
      SET 
        "firstName" = $1
        ,"lastName" = $2
        ,"updatedAt" = $3 
      WHERE "id" = $4
      ;`;
    const parameters = [
      userData.firstName,
      userData.lastName,
      userData.updatedAt,
      userData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
};
