const sequelize = require('@db');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('@utils/constants');
const { accessCookieOptions, refreshCookieOptions } = require('@utils/cookie.utils');

class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    async signIn(req, res) {
        const { user, tokens } = req.user;

        res.cookie(ACCESS_TOKEN, tokens.accessToken, accessCookieOptions);
        res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshCookieOptions);
        res.status(200).json(user);
    }

    async signUp(req, res) {
        const transaction = await sequelize.transaction();
        const { user, tokens } = await this.authService.signUp(req.body.company, req.body.user, transaction);

        await transaction.commit();
        res.cookie(ACCESS_TOKEN, tokens.accessToken, accessCookieOptions);
        res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshCookieOptions);
        res.status(201).json(user);
    }

    async me(req, res) {
        const user = await this.authService.me(req.user.id);
        res.status(200).json(user);
    }

    async refresh(req, res) {
        res.status(200).json(req.user);
    }
}

module.exports = AuthController;