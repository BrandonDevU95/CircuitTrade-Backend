require('dotenv').config();
const { config } = require('./src/config/config');

const express = require('express');
const configureCors = require('./src/middlewares/cors');
const PORT = config.port;

const app = express();

app.use(express.json());
configureCors(app);

app.get('/', (req, res) => {
	res.send('Hello World');
});

//Routes

//Errors Middleware

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
