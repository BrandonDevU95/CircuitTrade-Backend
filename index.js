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
const sequelize = require('./src/infrastructure/db/sequelize.config');

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

// Arranque de la aplicación
async function startServer() {
    try {
        await sequelize.authenticate();
        appLogger.info('Connection to the database has been established successfully.');
        app.listen(PORT, () => appLogger.info(`Server running on port ${PORT}`));
    } catch (error) {
        appLogger.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

startServer();

// Manejadores para cerrar el servidor al recibir señales de terminación
function shutdown(signal) {
    appLogger.info(`Received ${signal}. Closing server...`);
    process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
