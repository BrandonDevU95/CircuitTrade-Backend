const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

class JWTManager {
	static generateTokens(user) {
		const accessToken = jwt.sign(
			{ sub: user.id, role: user.role },
			config.jwtSecret,
			{ expiresIn: '15m' }
		);

		const refreshToken = jwt.sign(
			{ sub: user.id },
			config.jwtRefreshSecret,
			{ expiresIn: '7d' }
		);

		return { accessToken, refreshToken };
	}

	static verifyRefreshToken(token) {
		return jwt.verify(token, config.jwtRefreshSecret);
	}
}

module.exports = JWTManager;
