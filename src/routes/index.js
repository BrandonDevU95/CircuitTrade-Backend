const express = require('express');

const companiesRouter = require('./companies.router');

function routerApi(app) {
	const router = express.Router();
	app.use('/api/v1', router);
	router.use('/companies', companiesRouter);
}

module.exports = routerApi;
