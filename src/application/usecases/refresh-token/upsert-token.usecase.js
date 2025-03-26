const { runInTransaction } = require('@utils/transaction.utils');

class UpsertTokenUseCase {
    constructor({ refreshTokenRepo }) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    async execute(userId, token, transaction = null) {
        return runInTransaction(async (t) => {
            return this.refreshTokenRepo.upsertToken(
                userId,
                {
                    token,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 días
                },
                { transaction: t }
            );
        }, transaction);
    }
}

module.exports = UpsertTokenUseCase;