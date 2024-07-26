require('dotenv').config();
const { config } = require('./src/config/config');

const express = require('express');
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

app.get('/', (req, res) => {
	res.send('Hello World');
});

//Routes

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
