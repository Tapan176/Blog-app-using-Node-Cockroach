class Dal {
  async insertUser (dbClient, userData) {
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
    const parameters = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.hashedPassword];
    await dbClient.query(sqlStmt, parameters);
  }

  async selectUserByEmail (dbClient, userData) {
    const sqlStmt = `
      SELECT 
        "id",
        "firstName"
        ,"lastName"
        ,"email"
        ,"passwordHash"
        ,"role" 
      FROM "users" 
      WHERE "email" = $1
      ;`;
    const parameters = [userData.email];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async updatePassword (dbClient, userData) {
    const sqlStmt = `
      UPDATE "users" 
      SET "passwordHash" = $1 
      WHERE "email" = $2
      ;`;
    const parameters = [userData.passwordHash, userData.email];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }
}

module.exports = new Dal();
