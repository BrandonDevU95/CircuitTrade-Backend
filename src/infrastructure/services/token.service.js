const { logger } = require('@infrastructure/logger');
const JWTManager = require('@infrastructure/utils/jwt.utils');

const jwtLogger = logger.injectContext('TOKEN_SERVICE');
class TokenService {
    generateTokens(user) {
        const accessToken = JWTManager.generateAccessToken(user);
        const refreshToken = JWTManager.generateRefreshToken(user);

        if (!accessToken || !refreshToken) {
            jwtLogger.error('Error generating tokens for user:', user.id);
            throw new Error('Error generating tokens');
        }

        return { accessToken, refreshToken };
    }

    generateAccessToken(user) {
        try {
            return JWTManager.generateAccessToken(user);
        } catch (error) {
            jwtLogger.error('Error generating access token:', error.message);
            throw new Error('Error generating access token');
        }
    }

    verifyAccessToken(token) {
        try {
            return JWTManager.verifyAccessToken(token);
        } catch (error) {
            jwtLogger.error('Invalid access token:', error.message);
            throw new Error('Invalid access token');
        }
    }

    verifyRefreshToken(token) {
        try {
            return JWTManager.verifyRefreshToken(token);
        } catch (error) {
            jwtLogger.error('Invalid refresh token:', error.message);
            throw new Error('Invalid refresh token');
        }
    }

    decodeToken(token) {
        try {
            return JWTManager.decodeToken(token);
        } catch (error) {
            jwtLogger.error('Error decoding token:', error.message);
            throw new Error('Error decoding token');
        }
    }

    isExpired(token) {
        try {
            return JWTManager.isExpired(token);
        } catch (error) {
            jwtLogger.error('Error checking token expiration:', error.message);
            throw new Error('Error checking token expiration');
        }
    }
}

module.exports = TokenService;
