const services = require('./user.service');

class Controller {
  async getAllUserDetails (request, response, next) {
    try {
      const responseBody = await services.getAllUserDetails();
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetailsById (request, response, next) {
    try {
      const { userId } = request.params;
      const responseBody = await services.getUserDetailsById(userId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetailsByEmail (request, response, next) {
    try {
      const { userEmail } = request.body;
      const responseBody = await services.getUserDetailsByEmail(userEmail);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async createUser (request, response, next) {
    try {
      const {
        firstName, lastName, email, password, confirmPassword, isVerified, role,
      } = request.body;
      const responseBody = await services.createUser(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        isVerified,
        role,
      );
      response.status(201).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async editUser (request, response, next) {
    try {
      const { userId } = request.params;
      const {
        firstName, lastName, email, isVerified, role,
      } = request.body;
      const responseBody = await services.editUser(
        userId,
        firstName,
        lastName,
        email,
        isVerified,
        role,
      );
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser (request, response, next) {
    try {
      const { userId } = request.params;
      const responseBody = await services.deleteUser(userId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async changePassword (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { oldPassword, newPassword, confirmNewPassword } = request.body;
      const responseBody = await services.changePassword(
        userId,
        oldPassword,
        newPassword,
        confirmNewPassword,
      );
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async changeName (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { firstName, lastName } = request.body;
      const responseBody = await services.changeName(userId, firstName, lastName);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
