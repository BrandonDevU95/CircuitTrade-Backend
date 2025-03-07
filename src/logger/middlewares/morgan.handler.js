const morgan = require('morgan');

// Función que recibe el logger y devuelve el middleware de Morgan
const morganLoggerHandler = (logger) => {
    return morgan((tokens, req, res) => {
        // Extraer correlationId inyectado por expressMiddleware, si existe.
        const cleanUserAgent = (ua) => ua?.replace(/[^\w\s]/gi, '') || 'unknown'; // Previene log injection attacks

        const logData = {
            ip: req.ip,
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            method: tokens.method(req, res),
            userAgent: cleanUserAgent(req.headers['user-agent']),
            contentLength: tokens.res(req, res, 'content-length'),
            responseTime: tokens['response-time'](req, res) + 'ms',
            message: `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens['response-time'](req, res)}ms`,
        };

        // Se registra la solicitud HTTP en el nivel 'http'
        logger.http('[HTTP Request]', {
            context: 'HTTP',
            ...logData
        });

        return null; // Morgan no necesita retornar un string
    }, {
        stream: { write: () => { } } // Se deshabilita la salida por defecto de Morgan
    });
};

module.exports = morganLoggerHandler;
