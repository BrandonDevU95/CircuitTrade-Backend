const boom = require('@hapi/boom');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class RevokeToken {
    constructor({ refreshTokenRepo }) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    async execute(userId, transaction = null) {
        return runInTransaction(async (t) => {
            const deletedCount = await this.refreshTokenRepo.delete(userId, { transaction: t });
            if (deletedCount === 0) throw boom.notFound('No refresh token found');
            return { userId, message: 'Token revoked successfully' };
        }, transaction);
    }
}

module.exports = RevokeToken;