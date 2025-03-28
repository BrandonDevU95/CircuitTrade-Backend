const sequelize = require('@infrastructure/db');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('@infrastructure/utils/constants');
const { accessCookieOptions, refreshCookieOptions } = require('@infrastructure/utils/cookie.utils');

class AuthController {
    constructor({
        signUpUseCase,
        userInfoUseCase,
    }) {
        this.signUpUseCase = signUpUseCase;
        this.userInfoUseCase = userInfoUseCase;
    }

    async signIn(req, res) {
        const { user, tokens } = req.user;

        res.cookie(ACCESS_TOKEN, tokens.accessToken, accessCookieOptions);
        res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshCookieOptions);
        res.status(200).json(user);
    }

    async signUp(req, res) {
        const transaction = await sequelize.transaction();
        const { user, tokens } = await this.signUpUseCase.execute(req.body.company, req.body.user, transaction);

        await transaction.commit();
        res.cookie(ACCESS_TOKEN, tokens.accessToken, accessCookieOptions);
        res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshCookieOptions);
        res.status(201).json(user);
    }

    async me(req, res) {
        const user = await this.userInfoUseCase.execute(req.user.id);
        res.status(200).json(user);
    }

    async refresh(req, res) {
        res.status(200).json(req.user);
    }
}

module.exports = AuthController;