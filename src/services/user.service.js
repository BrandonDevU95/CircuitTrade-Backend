const boom = require('@hapi/boom');
const sequelize = require('../lib/sequelize');
const { models } = require('./../lib/sequelize');

class UserService {
	constructor() {
		this.model = models.User;
	}

	async create(data) {
		const transaction = await sequelize.transaction();
		const { rfc, email, ...userData } = data;

		try {
			// Se utiliza el método helper 'normalizeEmail' para obtener el email normalizado
			const normalizedEmail = this.model.normalizeEmail(email);
			const normalizedRfc = rfc.toUpperCase();
			const normalizedRoleName = models.Role.normalizeName(userData.role);

			// Prevención de duplicados por email
			const existingUser = await this.model.findOne({
				where: { email: normalizedEmail },
				transaction,
			});
			if (existingUser) {
				throw boom.badRequest('User already exists');
			}

			const company = await models.Company.findOne({
				where: { rfc: normalizedRfc },
				transaction,
			});
			if (!company) {
				throw boom.badRequest('Company not found');
			}

			const role = await models.Role.findOne({
				where: { name: normalizedRoleName },
				transaction,
			});

			if (!role) {
				throw boom.badRequest('Role not found');
			}

			const newUser = await this.model.create(
				{
					...userData,
					email: normalizedEmail,
					companyId: company.id,
					roleId: role.id,
				},
				{ transaction }
			);

			await transaction.commit();
			//Retornar el usuario sin el password
			return newUser;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update(id, data) {
		const transaction = await sequelize.transaction();
		try {
			const user = await this.model.findByPk(id, { transaction });

			if (!user) {
				throw boom.notFound('User not found');
			}

			// Se utiliza un objeto 'updateData' para procesar actualizaciones parciales
			const updateData = { ...data };

			// Solo se procesa la normalización y verificación de duplicados si 'email' está presente
			if (updateData.email) {
				const normalizedEmail = this.model.normalizeEmail(
					updateData.email
				);
				const existingUser = await this.model.findOne({
					where: { email: normalizedEmail },
					transaction,
				});
				if (existingUser && existingUser.id !== id) {
					throw boom.badRequest('Email already exists');
				}
				updateData.email = normalizedEmail;
			}

			if (updateData.role) {
				const normalizedRoleName = models.Role.normalizeName(
					updateData.role
				);
				const role = await models.Role.findOne({
					where: { name: normalizedRoleName },
					transaction,
				});

				if (!role) {
					throw boom.badRequest('Role not found');
				}
				updateData.roleId = role.id;
				delete updateData.role;
			}

			const updatedUser = await user.update(updateData, { transaction });
			await transaction.commit();
			return updatedUser;
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
		const user = await this.model.findByPk(id, {
			include: [
				{
					model: models.Role,
					as: 'role',
				},
			],
		});
		if (!user) {
			throw boom.notFound('User not found');
		}
		return user;
	}

	async findByEmail(email) {
		const user = await this.model.findOne({
			where: { email },
		});

		return user;
	}
}

module.exports = UserService;
