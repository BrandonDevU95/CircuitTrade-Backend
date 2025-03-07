const { v4: uuidv4 } = require('uuid');

// Middleware que inyecta un logger con contexto en el objeto request
const requestLoggerHandler = (logger) => (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();

    // Extraer los primeros 8 caracteres para visualización
    const shortId = correlationId.split('-')[0];

    // Inyectar correlationId inmediatamente en el objeto req
    req.correlationId = correlationId;
    req.shortCorrelationId = shortId;

    req.logger = logger.child({
        correlationId,
        ip: req.ip,
        user: req.user?.id || 'anonymous',
        method: req.method,
        url: req.originalUrl
    });

    // Registrar inicio de la request aquí
    req.logger.info(`Incoming request: [${shortId}]`, { context: 'START' });

    // Monkey-patching para capturar el fin de la request
    const originalEnd = res.end;

    res.end = function (...args) {
        req.logger.info(`Request completed: [${shortId}]`, {
            context: 'END',
            status: res.statusCode,
            content_length: res.get('Content-Length'),
            cache_status: res.get('X-Cache-Status') || 'MISS',
        });
        originalEnd.apply(res, args);
    };

    next();
};

module.exports = requestLoggerHandler;