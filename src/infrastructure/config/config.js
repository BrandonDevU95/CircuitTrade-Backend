require('dotenv').config();

const requiredEnvVars = [
	'DB_USER',
	'DB_PASSWORD',
	'DB_HOST',
	'DB_NAME',
	'API_KEY',
	'JWT_SECRET',
	'JWT_REFRESH_SECRET',
	'BCRYPT_SALT'
];

const config = {
	node: {
		env: process.env.NODE_ENV || 'development',
		port: process.env.PORT || 3000,
		version: process.env.VERSION
	},
	db: {
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		name: process.env.DB_NAME,
		port: process.env.DB_PORT || 3306
	},
	jwt: {
		apiKey: process.env.API_KEY,
		secret: process.env.JWT_SECRET,
		refreshSecret: process.env.JWT_REFRESH_SECRET
	},
	bcrypt: {
		saltRounds: parseInt(process.env.BCRYPT_SALT)
	},
	logs: {
		level: process.env.LOG_LEVEL || 'error', // Configura el nivel minimo de log
		console: {
			level: process.env.LOG_LEVEL_CONSOLE || 'error', // Configura el nivel minimo de log en consola
			enabled: process.env.LOG_CONSOLE_ENABLED || false // Habilita o deshabilita la salida de logs en consola
		},
		file: {
			enabled: process.env.LOG_FILE_ENABLED || false // Habilita o deshabilita la salida de logs en archivo
		}
	}
};

module.exports = { requiredEnvVars, config };