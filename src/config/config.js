require('dotenv').config();

const config = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	version: process.env.VERSION,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbName: process.env.DB_NAME,
	dbPort: process.env.DB_PORT,
	apiKey: process.env.API_KEY,
	jwtSecret: process.env.JWT_SECRET,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT),
	logs: {
		logLevel: process.env.LOG_LEVEL || 'error', // Configura el nivel minimo de log
		logLevelConsole: process.env.LOG_LEVEL_CONSOLE || 'error', // Configura el nivel minimo de log en consola
		logConsoleEnabled: process.env.LOG_CONSOLE_ENABLED || false, // Habilita o deshabilita la salida de logs en consola
		logFileEnabled: process.env.LOG_FILE_ENABLED || false, // Habilita o deshabilita la salida de logs en archivo
	}
};

module.exports = { config };
