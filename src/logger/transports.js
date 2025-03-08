const { transports, format } = require('winston');
const { config } = require('@config/config');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Función generadora de transportes con rotación
const createRotatingTransport = ({
    level,
    filename,
    datePattern = 'YYYY-MM-DD',
    maxFiles = '30d',
    maxSize = '20m',
    withLevelFilter = false
}) => {
    const baseConfig = {
        level,
        filename: path.join('logs', level.toLowerCase(), filename),
        datePattern,
        zippedArchive: true,
        maxSize,
        maxFiles,
        async: true,
        maxParallelFiles: 2,
        options: {
            mode: 0o644,
            flags: 'a'
        },
        format: withLevelFilter
            ? format.combine(
                format(info => info.level === level ? info : false)(),
                format.json()
            )
            : format.json()
    };

    return new DailyRotateFile(baseConfig);
};

// Configuraciones comunes para los transportes
const transportConfigs = [
    {
        level: 'error',
        filename: 'errors-%DATE%.log',
        maxFiles: '60d'
    },
    {
        level: 'info',
        filename: 'info-%DATE%.log',
        withLevelFilter: true
    },
    {
        level: 'http',
        filename: 'http-%DATE%.log',
        withLevelFilter: true
    },
    {
        level: 'debug',
        filename: 'debug-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '50m',
        maxFiles: '3d'
    }
];

// Generar todos los transportes
const baseTransports = transportConfigs.map(createRotatingTransport);

// Transporte para consola (sin cambios)
const consoleTransport = new transports.Console({
    level: config.logs.logLevelConsole,
    format: format.combine(
        format.colorize(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    )
});

module.exports = { baseTransports, consoleTransport };