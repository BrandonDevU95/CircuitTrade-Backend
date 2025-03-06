const boom = require('@hapi/boom');
const sequelize = require('@db');
const { runInTransaction } = require('@utils/transaction.utils');

class refreshTokenService {
	constructor() {
		this.refreshTokenModel = sequelize.models.RefreshToken;
		this.userModel = sequelize.models.User;
	}

	async upsertRefreshToken(userId, token, transaction = null) {
		return runInTransaction(async (t) => {
			const [result] = await this.refreshTokenModel.upsert(
				{
					userId,
					token,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
				},
				{ returning: true, conflictFields: ['userId'], transaction: t } // Actualiza si ya existe
			);

			return result.get({ plain: true });
		}, transaction);
	}

	async getTokensByUserId(userId) {
		const refreshToken = await this.refreshTokenModel.findOne({
			where: { userId },
			include: {
				model: this.userModel,
				as: 'user',
				attributes: ['id', 'role_id'],
			},
			rejectOnEmpty: boom.notFound('Token not found'),
		});

		return refreshToken;
	}

	async deleteToken(userId) {
		return sequelize.transaction(async (transaction) => {
			const deletedCount = await this.refreshTokenModel.destroy({
				where: { userId },
				transaction
			});

			if (deletedCount === 0) throw boom.notFound('Failed to delete token: No rows affected');


			return {
				id: userId,
				message: 'Token revoked successfully'
			};
		});
	}
}

module.exports = refreshTokenService;
