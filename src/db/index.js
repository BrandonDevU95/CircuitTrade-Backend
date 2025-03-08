const { Sequelize } = require('sequelize');
const setupModels = require('./models');
const { config } = require('@config/config');
const { logger } = require('@logger');
const env = config.node.env || 'development';
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

const dbLogger = logger.injectContext('SEQUELIZE_DB');

setupModels(sequelize);

//No ejecutar en produccion ya que borra la base de datos
if (env === 'development') {
	sequelize
		.sync({ force: false }) // false para no borrar la base de datos
		.then(() => dbLogger.info('Database synchronized'))
		.catch((error) => dbLogger.error('An error occurred while synchronizing the database:', error));
}

//Health Checks
sequelize
	.authenticate()
	.then(() => {
		dbLogger.info('Connection has been established successfully.');
	})
	.catch((error) => {
		dbLogger.error('Unable to connect to the database:', error);
	});

module.exports = sequelize;
