const boom = require('@hapi/boom');

class GetTokenUseCase {
    constructor({ refreshTokenRepo }) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    async execute(userId) {
        const refreshToken = await this.refreshTokenRepo.findTokenByUserId(userId, {
            rejectOnEmpty: boom.notFound('No refresh token found')
        });

        return refreshToken;
    }
}

module.exports = GetTokenUseCase;