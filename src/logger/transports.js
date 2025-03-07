const { transports, format } = require('winston');
const { config } = require('@config/config');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Transportes basados en archivos con rotación diaria
const baseTransports = [
    new DailyRotateFile({
        level: 'info',
        filename: path.join('logs', 'info', 'info-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        async: true,
        maxParallelFiles: 2
    }),
    new DailyRotateFile({
        level: 'error',
        filename: path.join('logs', 'error', 'errors-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '60d',
        options: {
            mode: 0o644,  // Permisos
            flags: 'a'    // Modo de apertura
        },
        async: true,
        maxParallelFiles: 2
    }),
    new DailyRotateFile({
        level: 'http',
        filename: path.join('logs', 'http', 'http-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        options: {
            mode: 0o644,  // Permisos
            flags: 'a'    // Modo de apertura
        },
        async: true,
        maxParallelFiles: 2
    }),
    new DailyRotateFile({
        level: 'debug',
        filename: path.join('logs', 'debug', 'debug-%DATE%.log'),
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '50m',
        maxFiles: '3d',
        options: {
            mode: 0o644,  // Permisos
            flags: 'a'    // Modo de apertura
        },
        async: true,
        maxParallelFiles: 2
    })
];

// Transporte para la consola con salida colorizada
const consoleTransport = new transports.Console({
    level: config.logs.logLevelConsole,
    format: format.combine(
        format.colorize(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    )
});

module.exports = { baseTransports, consoleTransport };
