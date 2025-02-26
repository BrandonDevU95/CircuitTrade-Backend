const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

class JWTManager {
	static generateAccessToken(user) {
		return jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, {
			expiresIn: '1m',
		});
	}

	static generateRefreshToken(user) {
		return jwt.sign({ sub: user.id }, config.jwtRefreshSecret, {
			expiresIn: '7d',
		});
	}

	static verifyAccessToken(token) {
		return jwt.verify(token, config.jwtSecret);
	}

	static verifyRefreshToken(token) {
		return jwt.verify(token, config.jwtRefreshSecret);
	}

	static decodeToken(token) {
		return jwt.decode(token);
	}

	static isExpired(token) {
		const { exp } = jwt.decode(token);
		const currentTime = Date.now() / 1000;
		return currentTime > exp;
	}
}

module.exports = JWTManager;
