const boom = require('@hapi/boom');
const BaseRepository = require('./base.repository');

class RefreshTokenRepository extends BaseRepository {
    constructor({ model }) {
        super({ model });
    }

    async upsertToken(userId, token, options = {}) {
        try {
            const [refreshToken] = await this.model.upsert(
                { userId, token },
                { ...options, returning: true }
            );
            return refreshToken;
        } catch (error) {
            throw boom.boomify(error
                , { message: 'Error upserting refreshToken' }
            );
        }
    }

    async findTokenByUserId(userId, options = {}) {
        return this.model.findOne({
            where: { userId },
            include: ['user'],
            ...options
        });
    }
}

module.exports = RefreshTokenRepository;