const bcrypt = require('bcrypt');
const { config } = require('../config/config');

const ERROR_MESSAGES = {
	INVALID_PASSWORD: 'Invalid password input',
	ENCRYPTION_FAILED: 'Password encryption failed',
	VERIFICATION_FAILED: 'Password verification failed',
};

const encryptPassword = async (password) => {
	if (!password || typeof password !== 'string') {
		throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
	}

	try {
		return await bcrypt.hash(password, config.bcryptSaltRounds);
	} catch (error) {
		throw new Error(ERROR_MESSAGES.ENCRYPTION_FAILED, { cause: error });
	}
};

const verifyPassword = async (password, hashedPassword) => {
	if (!password || typeof password !== 'string') {
		throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
	}

	if (!hashedPassword || typeof hashedPassword !== 'string') {
		throw new Error('Invalid hashed password input');
	}

	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		throw new Error(ERROR_MESSAGES.VERIFICATION_FAILED, { cause: error });
	}
};

module.exports = { encryptPassword, verifyPassword };
