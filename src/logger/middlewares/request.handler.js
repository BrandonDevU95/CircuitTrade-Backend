const { v4: uuidv4 } = require('uuid');

// Middleware que inyecta un logger con contexto en el objeto request
const requestLoggerHandler = (logger) => {
    return (req, res, next) => {
        req.logger = logger.child({
            correlationId: req.headers['x-request-id'] || uuidv4(),
            ip: req.ip,
            user: req.user?.id || 'anonymous',
            method: req.method,
            url: req.originalUrl
        });
        next();
    };
};

module.exports = requestLoggerHandler;
