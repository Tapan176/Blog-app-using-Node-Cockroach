module.exports = {
    authenticateUser: async (req, res, next) => {
        if (req.session && req.session.user) {
            return next();
        } else {
            throw new Error('your_session_is_expired_please_login_again');
        }
    },
};