const { Sequelize } = require('sequelize');
const setupModels = require('./models');
const { config } = require('../config/config');
const env = config.env || 'development';
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

//No ejecutar en produccion ya que borra la base de datos
if (env === 'development') {
	sequelize
		.sync({ force: false }) // false para no borrar la base de datos
		.then(() => console.log('Database & tables created!'));
}

//Health Checks
sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch((error) => {
		console.error('Unable to connect to the database:', error);
	});

module.exports = sequelize;
