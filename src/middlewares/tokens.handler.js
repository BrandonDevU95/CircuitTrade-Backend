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
        // Verificacion firma del token y expiracion
        const payload = tokenService.verifyAccessToken(accessToken);

        req.user = payload;
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

        // Verificar firma del token y expiración
        const payload = tokenService.verifyRefreshToken(refreshToken);;

        // Verificar si el refresh token está en la base de datos y es válido
        const storedToken = await refreshTokenService.getTokenByUserId(payload.sub);
        const isRefreshTokenValid = tokenService.isExpired(storedToken.token);

        if (isRefreshTokenValid) {
            res.clearCookie(REFRESH_TOKEN);
            await refreshTokenService.revokeToken(storedToken.user.id);
            next(boom.unauthorized('Invalid refresh token'));
            return;
        }

        if (storedToken.token !== refreshToken) {
            res.clearCookie(REFRESH_TOKEN);
            await refreshTokenService.revokeToken(payload.sub);
            next(boom.unauthorized('Invalid refresh token'));
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
        res.clearCookie(REFRESH_TOKEN);
        next(error);
    }
}

module.exports = { accessTokenHandler, refreshTokenHandler };