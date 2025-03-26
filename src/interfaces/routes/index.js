const express = require('express');

const authRouter = require('./auth.router');
const rolesRouter = require('./roles.router');
const usersRouter = require('./users.router');
const companiesRouter = require('./companies.router');

function routerApi(app) {
	const router = express.Router();
	app.use('/api/v1', router);
	router.use('/companies', companiesRouter);
	router.use('/roles', rolesRouter);
	router.use('/users', usersRouter);
	router.use('/auth', authRouter);
}

module.exports = routerApi;
