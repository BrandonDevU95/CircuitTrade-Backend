const boom = require('@hapi/boom');
const container = require('@config/container');
const cookieOptions = require('@utils/cookie.utils');

const tokenService = container.resolve('tokenService');
const refreshTokenService = container.resolve('refreshTokenService');

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
		const isAccessTokenExpired = tokenService.isExpired(accessToken);

		if (!isAccessTokenExpired) {
			const payload = tokenService.verifyAccessToken(accessToken);
			req.user = payload;
			return next();
		}

		// 3. Verificar si hay Refresh Token desde la DB
		const accessPayload = tokenService.decodeToken(accessToken);
		const refreshToken = await refreshTokenService.getTokenByUserId(accessPayload.sub);
		const isRefreshTokenExpired = tokenService.isExpired(refreshToken.token);

		if (isRefreshTokenExpired) {
			res.clearCookie(ACCESS_TOKEN);
			await refreshTokenService.revokeToken(refreshToken.user.id);
			next(boom.unauthorized('Refresh token has expired'));
			return;
		}

		// 4. Generar nuevo Access Token
		const newAccessToken = tokenService.generateAccessToken({
			id: refreshToken.user.id,
			role: refreshToken.user.role_id,
		});

		res.cookie(ACCESS_TOKEN, newAccessToken, cookieOptions); // Actualizar la cookie
		req.cookies[ACCESS_TOKEN] = newAccessToken; // Actualizar el objeto cookies

		req.user = tokenService.decodeToken(newAccessToken);
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = userAuth;
