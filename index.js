// Core modlues
const express = require('express');

// Third party modules
require('dotenv').config();
require('module-alias/register');
require('express-async-errors');
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");


// Custom modules
const sequelize = require('@infrastructure/db');
const routerApi = require('@interfaces/routes');
const { config, requiredEnvVars } = require('@infrastructure/config/config');
const configureCors = require('@interfaces/middlewares/cors');
const configureAuth = require('@infrastructure/auth');
const { logger } = require('@infrastructure/logger');
const morganLoggerHandler = require('@infrastructure/logger/middlewares/morgan.handler');
const requestLoggerHandler = require('@infrastructure/logger/middlewares/request.handler');
const {
    logErrors,
    ormErrorHandler,
    boomErrorHandler,
    errorHandler,
    notFoundHandler,
} = require('@interfaces/middlewares/error.handler');

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing ${envVar} environment variable`);
    }
});

if (isNaN(config.bcrypt.saltRounds) || config.bcrypt.saltRounds < 1) {
    throw new Error('Invalid BCRYPT_SALT environment variable');
}

// Constants
const PORT = config.node.port;
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    skip: (req) => req.path === "/health"
});
const appLogger = logger.injectContext('APP');
const dbLogger = logger.injectContext('DB');

// Settings (Ej: Nginx)
app.set('trust proxy', 1);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(requestLoggerHandler(logger));
app.use(morganLoggerHandler());
configureCors(app);

// Auth Strategies
configureAuth(app);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: config.node.version,
        environment: config.node.env
    });
});

//Routes
routerApi(app);

// 404 Handler
app.use(notFoundHandler);

// Error handlers
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Server
async function startServer() {
    try {
        // Paso 1: Autenticación con la base de datos (Health Check)
        await sequelize.authenticate();
        dbLogger.info('Connection to the database has been established successfully.');

        // Paso 2: Sincronización solo en desarrollo
        if (config.node.env === 'development') {
            await sequelize.sync({ force: false });
            dbLogger.info('Database synchronized');
        }

        // Paso 3: Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            appLogger.info(`Server running on port ${PORT}`);
        });

        // Paso 4: Manejadores de cierre
        const gracefulShutdown = async (signal) => {
            dbLogger.info(`Received ${signal}. Closing connections...`);

            try {
                // Cerrar conexión de Sequelize
                await sequelize.close();
                dbLogger.info('Database connection closed');

                // Cerrar servidor HTTP
                server.close(() => {
                    appLogger.info('HTTP server closed');
                    process.exit(0);
                });

                // Force close después de 5 segundos
                setTimeout(() => {
                    appLogger.error('Forcing shutdown...');
                    process.exit(1);
                }, 5000);

            } catch (error) {
                dbLogger.error('Error during shutdown:', error);
                process.exit(1);
            }
        };

        // Capturar señales de terminación
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        dbLogger.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

startServer();