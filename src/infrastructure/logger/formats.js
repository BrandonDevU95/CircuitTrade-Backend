const { format } = require('winston');
const { printf } = format;

// Formato para ocultar datos sensibles en metadatos
const sensitiveKeys = ['password', 'token', 'creditCard', 'authorization', 'sessionId'];

const secureFormat = format((info) => {
    if (info.metadata) {
        // Proteger Headers, Query Params y Cookies
        ['body', 'headers', 'queryParams', 'cookies'].forEach(section => {
            if (info.metadata[section]) {
                for (const field of sensitiveKeys) {
                    if (info.metadata[section][field]) {
                        info.metadata[section][field] = '*****';
                    }
                }
            }
        });
    }
    return info;
})();

// Formato personalizado para estructurar la salida de log en JSON
const logFormatter = printf(({ level, message, timestamp, stack, metadata }) => {
    const logData = {
        timestamp,
        service: 'backend',
        level: level.toUpperCase(),
        message: stack || message,
        ...metadata
    };
    return JSON.stringify(logData);
});

module.exports = { secureFormat, logFormatter };
