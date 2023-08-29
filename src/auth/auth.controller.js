const services = require('./auth.services');

module.exports = {
    login: async (request, response, next) => {
        try {
            const { email, password } = request.body;
            const responseBody = { message: await services.login(email, password), code: 'login_succesfull' };
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    signUp: async (request, response, next) => {
        try {
            const { firstName, lastName, email, password, confirmPassword } = request.body;
            const responseBody = { message: await services.signUp(firstName, lastName, email, password, confirmPassword), code:'signUp_succesfull' };
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};