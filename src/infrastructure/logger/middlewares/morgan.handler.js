const morgan = require('morgan');

// Función que recibe el logger y devuelve el middleware de Morgan
const morganLoggerHandler = () => {
    return morgan((tokens, req, res) => {
        if (!req.logger) return null; // Fail-safe

        // Sanitiza el User-Agent para evitar caracteres especiales
        const cleanUserAgent = (ua) => ua?.replace(/[^\w\s]/gi, '') || 'unknown';
        const shortId = req.shortCorrelationId;

        req.logger.http(`HTTP Request: [${shortId}]`, {
            context: 'HTTP',
            http: {
                method: tokens.method(req, res),
                url: tokens.url(req, res),
                status: Number(tokens.status(req, res)),
                response_time: Number(tokens['response-time'](req, res)),
                content_length: tokens.res(req, res, 'content-length'),
                user_agent: cleanUserAgent(req.headers['user-agent'])
            }
        });

        // Morgan no necesita retornar un string
        return null;
    }, {
        // Se deshabilita la salida por defecto de Morgan
        stream: { write: () => { } }
    });
};

module.exports = morganLoggerHandler;
