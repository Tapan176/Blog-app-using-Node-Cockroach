const service = require('./user.service');

module.exports = {
    getAllUserDetails: async (request, response, next) => {
        try {
            const responseBody = await service.getAllUserDetails();
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getUserDetailsById: async (request, response, next) => {
        try {
            const userId = request.params.id;
            const responseBody = await service.getUserDetailsById(userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getUserDetailsByEmail: async (request, response, next) => {
        try {
            const userEmail = request.body.email;
            const responseBody = await service.getUserDetailsByEmail(userEmail);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};