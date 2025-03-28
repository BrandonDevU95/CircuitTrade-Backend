const { logger } = require('@infrastructure/logger');
const { config } = require('@infrastructure/config/config');
const { ValidationError, UniqueConstraintError } = require('sequelize');

const errorLogger = logger.injectContext('ERROR');

function logErrors(err, req, res, next) {
	errorLogger.error(err.stack);
	next(err);
}

function errorHandler(err, req, res) {
	errorLogger.error(err.stack);
	const response = {
		message: err.message,
	};

	// Solo incluir el stack en desarrollo
	if (config.node.env === 'development') {
		errorLogger.debug(err.stack);
		response.stack = err.stack;
	}

	res.status(500).json(response);
}

function boomErrorHandler(err, req, res, next) {
	if (err.isBoom) {
		const { output } = err;
		errorLogger.error(output.payload);
		res.status(output.statusCode).json(output.payload);
	} else {
		next(err);
	}
}

function ormErrorHandler(err, req, res, next) {
	if (err instanceof ValidationError) {
		errorLogger.error(err.errors);
		res.status(400).json({
			statusCode: 400,
			message: 'Validation error',
			errors: err.errors.map((e) => ({
				field: e.path,
				message: e.message,
			})),
		});
	} else if (err instanceof UniqueConstraintError) {
		errorLogger.error(err.errors);
		res.status(409).json({
			statusCode: 409,
			message: 'Duplicate entry',
			errors: err.errors.map((e) => ({
				field: e.path,
				message: e.message,
			})),
		});
	} else {
		next(err);
	}
}

function notFoundHandler(req, res) {
	res.status(404).json({
		message: 'Not found',
		status: 404,
	});
}

module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler, notFoundHandler };
