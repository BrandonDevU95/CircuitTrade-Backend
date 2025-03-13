const { transports, format } = require('winston');
const { config } = require('../config/env.config');
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
                format((info) => {
                    return info.level === level.toLowerCase() ? info : false;
                })(),
                format.json()
            )
            : format.json()
    };

    const transport = new DailyRotateFile(baseConfig);

    transport.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.error(`Error en transporte ${level}:`, error);
    });

    return transport;
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
    level: config.logs.console.level,
    format: format.combine(
        format.colorize(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    )
});

module.exports = { baseTransports, consoleTransport };