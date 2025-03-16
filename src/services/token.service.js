const JWTManager = require('@utils/jwt.utils');

class TokenService {
    generateTokens(user) {
        const accessToken = JWTManager.generateAccessToken(user);
        const refreshToken = JWTManager.generateRefreshToken(user);

        if (!accessToken || !refreshToken) {
            throw new Error('Error generating tokens');
        }

        return { accessToken, refreshToken };
    }
}

module.exports = TokenService;
