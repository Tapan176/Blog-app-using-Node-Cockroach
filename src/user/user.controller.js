const services = require('./user.service');

module.exports = {
    getAllUserDetails: async (request, response, next) => {
        try {
            const responseBody = await services.getAllUserDetails();
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getUserDetailsById: async (request, response, next) => {
        try {
            const { userId } = request.params;
            const responseBody = await services.getUserDetailsById(userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getUserDetailsByEmail: async (request, response, next) => {
        try {
            const { userEmail } = request.body;
            const responseBody = await services.getUserDetailsByEmail(userEmail);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    createUser: async (request, response, next) => {
        try {
            const { firstName, lastName, email, password, confirmPassword, isVerified, role } = request.body;
            const responseBody = await services.createUser(firstName, lastName, email, password, confirmPassword, isVerified, role);
            response.status(201).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    editUser: async (request, response, next) => {
        try {
            const { userId } = request.params;
            const { firstName, lastName, email, isVerified, role } = request.body;
            const responseBody = await services.editUser(userId, firstName, lastName, email, isVerified, role);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (request, response, next) => {
        try {
            const { userId } = request.params;
            const responseBody = await services.deleteUser(userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};