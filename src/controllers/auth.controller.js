const cookieOptions = require('@utils/cookie.utils');

class AuthController {
    constructor(authService, refreshTokenService, tokenService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.tokenService = tokenService;
    }

    async signIn(req, res) {
        const user = req.user;

        const { accessToken, refreshToken } = this.tokenService.generateTokens(user);
        await this.refreshTokenService.upsertRefreshToken(user.id, refreshToken);

        res.cookie('access_token', accessToken, cookieOptions);
        res.status(200).json({ user });
    }

    async signUp(req, res) {
        const { company, user } = req.body;

        const userData = await this.authService.signUp(company, user);

        res.cookie('access_token', userData.accessToken, cookieOptions)
        res.status(201).json({ user: userData.user });
    }
}

module.exports = AuthController;