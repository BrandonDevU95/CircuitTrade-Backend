const boom = require('@hapi/boom');
const { runInTransaction } = require('@utils/transaction.utils');

class RefreshTokenService {
	constructor({ refreshTokenRepo }) {
		this.refreshTokenRepo = refreshTokenRepo;
	}

	async upsertRefreshToken(userId, token, transaction = null) {
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

	async getTokenByUserId(userId) {
		const refreshToken = await this.refreshTokenRepo.findTokenByUserId(userId, {
			rejectOnEmpty: boom.notFound('No refresh token found')
		});

		return refreshToken;
	}

	async revokeToken(userId, transaction = null) {
		return runInTransaction(async (t) => {
			const deletedCount = await this.refreshTokenRepo.delete(userId, { transaction: t });
			if (deletedCount === 0) throw boom.notFound('No refresh token found');
			return { userId, message: 'Token revoked successfully' };
		}, transaction);
	}
}

module.exports = RefreshTokenService;
