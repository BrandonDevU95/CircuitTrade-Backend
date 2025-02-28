const { ValidationError, UniqueConstraintError } = require('sequelize');

const { config } = require('../config/config');

function logErrors(err, req, res, next) {
	console.error(err);
	next(err);
}

function errorHandler(err, req, res, next) {
	const response = {
		message: err.message,
	};

	// Solo incluir el stack en desarrollo
	if (config.env === 'development') {
		response.stack = err.stack;
	}

	res.status(500).json(response);
}

function boomErrorHandler(err, req, res, next) {
	if (err.isBoom) {
		const { output } = err;
		res.status(output.statusCode).json(output.payload);
	} else {
		next(err);
	}
}

function ormErrorHandler(err, req, res, next) {
	if (err instanceof ValidationError) {
		res.status(400).json({
			statusCode: 400,
			message: 'Validation error',
			errors: err.errors.map((e) => ({
				field: e.path,
				message: e.message,
			})),
		});
	} else if (err instanceof UniqueConstraintError) {
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

module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };
