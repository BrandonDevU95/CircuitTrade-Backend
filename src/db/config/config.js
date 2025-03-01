const { config } = require('../../config/config');

module.exports = {
	development: {
		username: config.dbUser,
		password: config.dbPassword,
		database: config.dbName,
		host: config.dbHost,
		port: config.dbPort,
		dialect: 'mysql',
		logging: console.log,
		ssl: config.env === 'production',
		dialectOptions: {
			ssl: {
				require: config.env === 'production',
				rejectUnauthorized: false,
			},
		},
	},
	test: {
		username: config.dbUser,
		password: config.dbPassword,
		database: config.dbName,
		host: config.dbHost,
		port: config.dbPort,
		dialect: 'mysql',
	},
	production: {
		username: config.dbUser,
		password: config.dbPassword,
		database: config.dbName,
		host: config.dbHost,
		port: config.dbPort,
		dialect: 'mysql',
	},
};
