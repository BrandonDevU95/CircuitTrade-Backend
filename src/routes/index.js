const express = require('express');

const companiesRouter = require('./companies.router');
const rolesRouter = require('./roles.router');
const usersRouter = require('./users.router');
const authRouter = require('./auth.router');

function routerApi(app) {
	const router = express.Router();
	app.use('/api/v1', router);
	router.use('/companies', companiesRouter);
	router.use('/roles', rolesRouter);
	router.use('/users', usersRouter);
	router.use('/auth', authRouter);
}

module.exports = routerApi;
