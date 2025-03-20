const cookieOptions = require('@utils/cookie.utils');

class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    async signIn(req, res) {
        const result = await this.authService.authenticate(
            req.body.email,
            req.body.password
        );

        res.cookie('access_token', result.tokens.accessToken, cookieOptions);
        res.status(200).json(result);
    }

    async signUp(req, res) {
        const result = await this.authService.signUp(req.body.company, req.body.user);

        res.cookie('access_token', result.tokens.accessToken, cookieOptions);
        res.status(201).json(result);
    }
}

module.exports = AuthController;