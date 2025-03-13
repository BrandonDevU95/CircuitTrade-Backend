// Core modlues
const express = require('express');

// Third party modules
require('dotenv').config();
require('module-alias/register');
require('express-async-errors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Custom modules
const sequelize = require('./src/infrastructure/db');
const { config, requiredEnvVars } = require('./src/infrastructure/config/env.config');
const configureCors = require('./src/infrastructure/presentation/middleware/cors.handler');
// const configureAuth = require('./src/infrastructure/auth');
const { logger } = require('./src/infrastructure/logger');
const morganLoggerHandler = require('./src/infrastructure/logger/middlewares/morgan.handler');
const requestLoggerHandler = require('./src/infrastructure/logger/middlewares/request.handler');
const {
    logErrors,
    ormErrorHandler,
    boomErrorHandler,
    errorHandler,
    notFoundHandler,
} = require('./src/infrastructure/presentation/middleware/error.handler');

// Cargar contenedor de dependencias y conexión a la DB
const container = require('./src/infrastructure/config/container');

// Validate required environment variables
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing ${envVar} environment variable`);
    }
});

if (isNaN(config.bcrypt.saltRounds) || config.bcrypt.saltRounds < 1) {
    throw new Error('Invalid BCRYPT_SALT environment variable');
}

//Constants 
const PORT = config.node.port;
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    skip: (req) => req.path === "/health"
});
const appLogger = logger.injectContext('APP');

// Settings (Ej: Nginx)
app.set('trust proxy', 1);

// Middlewares básicos
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(requestLoggerHandler(logger));
app.use(morganLoggerHandler());
configureCors(app)

// Auth Strategies
// configureAuth(app);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: config.node.version,
        environment: config.node.env
    });
});

// Registrar rutas de usuarios usando el controlador inyectado desde el contenedor
const { createUserRouter } = require('./src/infrastructure/presentation/routes/users.routes');
const userController = container.resolve('userController');
app.use('/users', createUserRouter({ userController }));

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
        appLogger.info('Connection to the database has been established successfully.');

        // Paso 2: Sincronización solo en desarrollo
        if (config.node.env === 'development') {
            await sequelize.sync({ force: false });
            appLogger.info('Database synchronized');
        }

        // Paso 3: Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            appLogger.info(`Server running on port ${PORT}`);
        });

        // Paso 4: Manejadores de cierre
        const gracefulShutdown = async (signal) => {
            appLogger.info(`Received ${signal}. Closing connections...`);

            try {
                // Cerrar conexión de Sequelize
                await sequelize.close();
                appLogger.info('Database connection closed');

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
                appLogger.error('Error during shutdown:', error);
                process.exit(1);
            }
        };

        // Capturar señales de terminación
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        appLogger.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

startServer();