const { Sequelize } = require('sequelize');
const setupModels = require('./models');
const { config } = require('@config/config');
const env = config.node.env;
const connection = require('./config/config')[env];

const sequelize = new Sequelize(connection.database, connection.username, connection.password, {
	host: connection.host,
	port: connection.port,
	dialect: connection.dialect,
	logging: connection.logging,
	pool: connection.pool,
	ssl: connection.ssl,
	dialectOptions: connection.dialectOptions,
});

setupModels(sequelize);

module.exports = sequelize;
