const services = require('./auth.service');

module.exports = {
    login: async (request, response, next) => {
        try {
            const { email, password } = request.body;
            const responseBody = await services.login(email, password);
            request.session.user = { id: responseBody.id, 
                email: responseBody.email,
                firstName: responseBody.firstName,
                lastName: responseBody.lastName,
                role: responseBody.role };
            response.status(204).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    signup: async (request, response, next) => {
        try {
            const { firstName, lastName, email, password } = request.body;
            const responseBody = await services.signup(firstName, lastName, email, password, confirmPassword);
            response.status(201).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    logout: async (request, response, next) => {
        try {
            if (request.session.user) {
                request.session.destroy((error) => {
                    if (error) {
                        throw new Error('logout_failed');
                    } else {
                        response.status(204).json();
                    }
                });
            } else {
                throw new Error('user_has_not_login');
            }
        } catch (error) {
            next(error);
        }
    },
    forgotPassword: async (request, response, next) => {
        try {
          const { email } = request.body;
      
          const responseBody = await services.forgotPassword(email);
      
          response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    resetPassword: async (request, response, next) => {
        try {
          const { token } = request.query;
          const { newPassword, confirmPassword } = request.body;

          const responseBody = await services.resetPassword(token, newPassword);

          response.status(200).json(responseBody);
        } catch (error) {
          next(error);
        }
    },
};