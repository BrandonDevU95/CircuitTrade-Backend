require('dotenv').config();
const { config } = require('./src/config/config');
const routerApi = require('./src/routes');
const express = require('express');
const cookieParser = require('cookie-parser');
const configureCors = require('./src/middlewares/cors');
const {
	logErrors,
	ormErrorHandler,
	boomErrorHandler,
	errorHandler,
} = require('./src/middlewares/error.handler');
const PORT = config.port;

const app = express();

app.use(express.json());
configureCors(app);
app.use(cookieParser());

require('./src/auth');

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
	console.log(`Server is running on port ${PORT}`);
});
