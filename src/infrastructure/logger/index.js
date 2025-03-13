const { createLogger, format, transports, addColors } = require('winston');
const { combine, timestamp, metadata, errors } = format;
const { secureFormat, logFormatter } = require('./formats');
const { baseTransports, consoleTransport } = require('./transports');
const { config } = require('../config/env.config');
const { customLevels, customColors } = require('./customs');

// Se añaden los colores personalizados
addColors(customColors);

// Creación y configuración del logger principal
const logger = createLogger({
    levels: customLevels,
    level: config.logs.level,
    format: combine(
        errors({ stack: true }), // Captura el stack en errores
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), // Agrega marca de tiempo
        metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }), // Incluye metadatos
        secureFormat, // Filtra datos sensibles
        logFormatter // Formatea la salida en JSON
    ),
    transports: [],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/others/exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/others/rejections.log' })
    ]
});

// Transporte de Archivo Rotativo (solo si está activo)
if (config.logs.file.enabled === 'true') {
    baseTransports.forEach(transport => logger.add(transport));
}

if (config.logs.console.enabled === 'true') {
    logger.add(consoleTransport);
}

// Método para inyectar contexto en el logger (por ejemplo, para servicios específicos)
logger.injectContext = (context) => {
    return logger.child({ context });
};

module.exports = { logger };
