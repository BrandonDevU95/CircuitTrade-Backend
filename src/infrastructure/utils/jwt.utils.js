const jwt = require('jsonwebtoken');
const { config } = require('@infrastructure/config/config');

class JWTManager {
	static generateAccessToken(user) {
		return jwt.sign({ sub: user.id, role: user.role }, config.jwt.secret, {
			expiresIn: '15m',
		});
	}

	static generateRefreshToken(user) {
		return jwt.sign({ sub: user.id }, config.jwt.refreshSecret, {
			expiresIn: '7d',
		});
	}

	static verifyAccessToken(token) {
		return jwt.verify(token, config.jwt.secret);
	}

	static verifyRefreshToken(token) {
		return jwt.verify(token, config.jwt.refreshSecret);
	}

	static decodeToken(token) {
		return jwt.decode(token);
	}

	static isExpired(token) {
		try {
			const decode = jwt.decode(token);
			if (!decode || !decode.exp) {
				return true;
			}
			const currentTime = Date.now() / 1000;
			return currentTime > decode.exp;
		} catch (error) {
			return true;
		}
	}
}

module.exports = JWTManager;
