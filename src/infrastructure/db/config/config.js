const { config } = require('../../config/env.config');
const { logger } = require('../../logger')

const seqLogger = logger.injectContext('SEQUELIZE_CONFIG');

module.exports = {
	development: {
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: config.db.port,
		dialect: 'mysql',
		logging: (msg) => seqLogger.debug(msg),
		ssl: config.node.env === 'production',
		dialectOptions: {
			ssl: {
				require: config.node.env === 'production',
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
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: config.db.port,
		dialect: 'mysql',
	},
	production: {
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: config.db.port,
		dialect: 'mysql',
		pool: {
			max: 20, // Maximum number of connection in pool
			min: 5,
			acquire: 60000,
			idle: 30000,
		},
	},
};
