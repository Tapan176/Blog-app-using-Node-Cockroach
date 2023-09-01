const jwt = require('jsonwebtoken');

module.exports = {
    authenticateUser: async (req, res, next) => {
        if (req.session && req.session.user) {
            req.user = req.session.user;
            return next();
        } else {
            res.status(401).json({ code: 'please_login', message: 'Please login' });
        }
    },
    authenticateAdmin: async (req, res, next) => {
        if(req.session.user.role == 'admin'){
            return next();
        } else {
            res.status(401).json({ code: 'unauthorized', message: 'unauthorized' });
        }
    },
    verifyJwtToken: async (req, res, next) => {
        const { token } = req.query;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                next();
            } else {
                throw new Error('invalid_token');
            }
        } catch (error) {
            next(error);
        }
    },
};