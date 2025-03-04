const { config } = require('@config/config');

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
		pool: {
			max: 5, // Maximum number of connection in pool
			min: 0, // Minimum number of connection in pool
			acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
			idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
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
		pool: {
			max: 20, // Maximum number of connection in pool
			min: 5,
			acquire: 60000,
			idle: 30000,
		},
	},
};
