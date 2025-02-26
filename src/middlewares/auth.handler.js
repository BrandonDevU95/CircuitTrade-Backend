const JWTManager = require('../utils/jwt');
const boom = require('@hapi/boom');
const RefreshTokenService = require('../services/refreshToken.service');

const service = new RefreshTokenService();

const ACCESS_TOKEN = 'access_token';

async function userAuth(req, res, next) {
	try {
		const accessToken = req.cookies[ACCESS_TOKEN];

		// 1. Verificar si hay Access Token
		if (!accessToken) {
			next(boom.unauthorized('Access token is required'));
			return;
		}

		// 2. Verificar si el Access Token ha expirado
		const isAccessTokenExpired = JWTManager.isExpired(accessToken);

		if (!isAccessTokenExpired) {
			const payload = JWTManager.verifyAccessToken(accessToken);
			req.user = payload;
			return next();
		}

		// 3. Verificar si hay Refresh Token desde la DB
		const accessPayload = JWTManager.decodeToken(accessToken);
		const refreshToken = await service.getTokensByUserId(accessPayload.sub);
		const isRefreshTokenExpired = JWTManager.isExpired(refreshToken.token);

		if (isRefreshTokenExpired) {
			res.clearCookie(ACCESS_TOKEN);
			await service.deleteToken(refreshToken.user.id);
			next(boom.unauthorized('Refresh token has expired'));
			return;
		}

		// 4. Generar nuevo Access Token
		const newAccessToken = JWTManager.generateAccessToken({
			id: refreshToken.user.id,
			role: refreshToken.user.role_id,
		});

		res.cookie(ACCESS_TOKEN, newAccessToken, { httpOnly: true });
		req.cookies[ACCESS_TOKEN] = newAccessToken; // Actualizar el objeto cookies

		req.user = JWTManager.decodeToken(newAccessToken);
		next();
	} catch (error) {
		next(boom.unauthorized('Invalid access token'));
	}
}

module.exports = userAuth;
