const services = require('./auth.service');

module.exports = {
    login: async (request, response, next) => {
        try {
            const { email, password } = request.body;
            const responseBody = await services.login(email, password);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    signUp: async (request, response, next) => {
        try {
            const { firstName, lastName, email, password, confirmPassword } = request.body;
            const responseBody = await services.signUp(firstName, lastName, email, password, confirmPassword);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};