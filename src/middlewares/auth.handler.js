const boom = require('@hapi/boom');
const { config } = require('dotenv');

function checkApiKey(req, res, next) {
	const apiKey = req.headers['api'];
	if (apiKey === config.apiKey) {
		next();
	} else {
		next(boom.unauthorized('Invalid API Key'));
	}
}

function checkAdminRole(req, res, next) {
	const user = req.user;
	if (user.role === 'admin') {
		next();
	} else {
		next(boom.unauthorized('Invalid Role'));
	}
}

function checkRoles(...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			next(boom.unauthorized('Invalid Role'));
		} else {
			next();
		}
	};
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
