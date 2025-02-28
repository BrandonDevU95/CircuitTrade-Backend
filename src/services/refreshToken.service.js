const boom = require('@hapi/boom');
const sequelize = require('../lib/sequelize');

const { models } = require('./../lib/sequelize');

class refreshTokenService {
	constructor() {
		this.model = models.RefreshToken;
	}

	async upsertRefreshToken(userId, token, transaction) {
		try {
			const refreshToken = await this.model.upsert(
				{
					userId,
					token,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
				},
				{ returning: true, conflictFields: ['userId'], transaction } // Actualiza si ya existe
			);

			if (!refreshToken) {
				throw boom.badImplementation('Error creating refresh token');
			}

			return refreshToken;
		} catch (error) {
			throw error;
		}
	}

	async getTokensByUserId(userId) {
		const refreshToken = await this.model.findOne({
			where: { userId },
			include: {
				model: models.User,
				as: 'user',
				attributes: ['id', 'role_id'],
			},
		});

		if (!refreshToken) {
			throw boom.notFound('Token not found');
		}

		return refreshToken;
	}

	async deleteToken(userId) {
		const transaction = await sequelize.transaction();

		try {
			const refreshToken = await this.model.findOne({
				where: { userId },
				transaction,
			});

			if (!refreshToken) {
				throw boom.notFound('Token not found');
			}

			await refreshToken.destroy({ transaction });

			await transaction.commit();
			return { userId };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}

module.exports = refreshTokenService;
