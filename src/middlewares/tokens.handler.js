// auth.handler.js
const boom = require('@hapi/boom');
const container = require('@config/container');
const { accessCookieOptions } = require('@utils/cookie.utils');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('@utils/constants');

const tokenService = container.resolve('tokenService');
const refreshTokenService = container.resolve('refreshTokenService');

async function accessTokenHandler(req, res, next) {
    try {
        const accessToken = req.cookies[ACCESS_TOKEN];

        if (!accessToken) {
            next(boom.unauthorized('Access token is required'));
            return;
        }

        const isAccessTokenExpired = tokenService.isExpired(accessToken);

        if (isAccessTokenExpired) {
            next(boom.unauthorized('Access token has expired'));
            return;
        }

        req.user = tokenService.verifyAccessToken(accessToken);
        next();
    } catch (error) {
        next(error);
    }
}

async function refreshTokenHandler(req, res, next) {
    try {
        const refreshToken = req.cookies[REFRESH_TOKEN];

        if (!refreshToken) {
            next(boom.unauthorized('Refresh token is required'));
            return;
        }

        const payload = tokenService.decodeToken(refreshToken);

        // Verificar si el refresh token está en la base de datos y es válido
        const storedToken = await refreshTokenService.getTokenByUserId(payload.sub);
        const isRefreshTokenValid = tokenService.isExpired(storedToken.token);

        if (isRefreshTokenValid) {
            res.clearCookie(REFRESH_TOKEN);
            await refreshTokenService.revokeToken(storedToken.user.id);
            next(boom.unauthorized('Refresh token has expired'));
            return;
        }

        // Generar nuevo access token
        const newAccessToken = tokenService.generateAccessToken({
            id: storedToken.user.id,
            role: storedToken.user.role_id,
        });

        // Establecer la nueva cookie de access token
        res.cookie(ACCESS_TOKEN, newAccessToken, accessCookieOptions);
        req.user = tokenService.decodeToken(newAccessToken);
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { accessTokenHandler, refreshTokenHandler };