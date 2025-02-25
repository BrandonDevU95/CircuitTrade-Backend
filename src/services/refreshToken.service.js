const boom = require('@hapi/boom');
const sequelize = require('../lib/sequelize');

const { models } = require('./../lib/sequelize');

class refreshTokenService {
	constructor() {
		this.model = models.RefreshToken;
	}

	async upsertRefreshToken(userId, tokenData) {
		const transaction = await sequelize.transaction();

		try {
			const refreshToken = await this.model.upsert(
				{
					userId,
					...tokenData,
				},
				{ returning: true, conflictFields: ['userId'], transaction } // Actualiza si ya existe
			);
			await transaction.commit();
			return refreshToken;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async getTokensByUserId(userId) {
		const refreshToken = await this.model.findOne({
			where: { userId },
			include: {
				model: models.User,
				attributes: ['id', 'email'],
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
