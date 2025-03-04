require('dotenv').config();
require('module-alias/register');
const { config } = require('@config/config');
const routerApi = require('@routes');
const express = require('express');
const cookieParser = require('cookie-parser');
const configureCors = require('@middlewares/cors');
const {
	logErrors,
	ormErrorHandler,
	boomErrorHandler,
	errorHandler,
} = require('@middlewares/error.handler');
const PORT = config.port;

const app = express();

app.use(express.json());
configureCors(app);
app.use(cookieParser());

require('@auth');

app.get('/', (req, res) => {
	res.send('Hello World');
});

//Routes
routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server is running on port ${PORT}`);
});
