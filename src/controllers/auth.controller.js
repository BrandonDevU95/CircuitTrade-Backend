const cookieOptions = require('@utils/cookie.utils');

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
        // Revisa la logica ya que se puede repetir en la estrategia de JWT
        const result = await this.authService.signUp(req.body.company, req.body.user);

        res.cookie('access_token', result.tokens.accessToken, cookieOptions);
        res.status(201).json(result);
    }
}

module.exports = AuthController;