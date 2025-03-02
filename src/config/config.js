require('dotenv').config();

const config = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbName: process.env.DB_NAME,
	dbPort: process.env.DB_PORT,
	apiKey: process.env.API_KEY,
	jwtSecret: process.env.JWT_SECRET,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT),
};

module.exports = { config };
