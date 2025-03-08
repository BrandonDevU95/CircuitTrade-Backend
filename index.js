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
const { config, requiredEnvVars } = require('@config/config');
const routerApi = require('@routes');
const configureCors = require('@middlewares/cors');
const configureAuth = require('@auth');
const { logger } = require('@logger');
const morganLoggerHandler = require('@logger/middlewares/morgan.handler');
const requestLoggerHandler = require('@logger/middlewares/request.handler');
const {
	logErrors,
	ormErrorHandler,
	boomErrorHandler,
	errorHandler,
	notFoundHandler,
} = require('@middlewares/error.handler');

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
const server = app.listen(PORT, () => {
	appLogger.info(`Server is running on port ${PORT}`);
});

const shutdown = (signal) => {
	appLogger.info(`${signal} signal received. Closing server...`);
	server.close(() => {
		appLogger.info('Server closed');
		process.exit(0);
	});
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);