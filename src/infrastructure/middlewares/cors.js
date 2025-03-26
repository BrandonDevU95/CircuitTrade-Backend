const cors = require('cors');

const whitelist = ['http://localhost:8080'];

const options = {
	origin: (origin, callback) => {
		if (whitelist.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

function configureCors(app) {
	app.use(cors(options));
}

module.exports = configureCors;
