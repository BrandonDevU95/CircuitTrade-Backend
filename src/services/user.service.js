const boom = require('@hapi/boom');
const sequelize = require('../lib/sequelize');

const { models } = require('./../lib/sequelize');

class userService {
	constructor() {
		this.model = models.User;
	}

	async create(data) {
		const transaction = await sequelize.transaction();

		try {
			const { rfc, email, ...userData } = data;
			const emailLower = email.toLowerCase();
			const rfcUpper = rfc.toUpperCase();

			const existingUser = await this.model.findOne({
				where: {
					email: emailLower,
				},
				transaction,
			});

			if (existingUser) {
				throw boom.badRequest('User already exists');
			}

			const company = await models.Company.findOne({
				where: {
					rfc: rfcUpper,
				},
				transaction,
			});

			if (!company) {
				throw boom.badRequest('Company not found');
			}

			const newUser = await this.model.create(
				{
					...userData,
					email: emailLower,
					companyId: company.id,
				},
				{ transaction }
			);

			await transaction.commit();
			return newUser;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update(id, data) {
		const transaction = await sequelize.transaction();
		const emailLower = data.email.toLowerCase();

		try {
			const user = await this.model.findByPk(id, { transaction });

			if (!user) {
				throw boom.notFound('User not found');
			}

			if (data.email) {
				const existingUser = await this.model.findOne({
					where: {
						email: emailLower,
					},
					transaction,
				});

				if (existingUser && existingUser.id !== id) {
					throw boom.badRequest('Email already exists');
				}
			}

			const updaterUser = await user.update(data, { transaction });
			await transaction.commit();
			return updaterUser;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(id) {
		const transaction = await sequelize.transaction();

		try {
			const user = await this.model.findByPk(id, { transaction });

			if (!user) {
				throw boom.notFound('User not found');
			}

			await user.destroy({ transaction });
			await transaction.commit();
			return { id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async find() {
		const users = await this.model.findAll();
		return users;
	}

	async findOne(id) {
		const user = await this.model.findByPk(id);
		if (!user) {
			throw boom.notFound('User not found');
		}
		return user;
	}
}

module.exports = userService;
