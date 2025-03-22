const cookieOptions = require('@utils/cookie.utils');
const sequelize = require('@db');

class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    async signIn(req, res) {
        const { user, tokens } = req.user;

        res.cookie('access_token', tokens.accessToken, cookieOptions);
        res.status(200).json({ user, tokens });
    }

    async signUp(req, res) {
        const transaction = await sequelize.transaction();
        const result = await this.authService.signUp(req.body.company, req.body.user, transaction);

        await transaction.commit();
        res.cookie('access_token', result.tokens.accessToken, cookieOptions);
        res.status(201).json(result);
    }
}

module.exports = AuthController;