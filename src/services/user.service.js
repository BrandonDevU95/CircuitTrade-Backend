const boom = require('@hapi/boom');
const sequelize = require('@db');

class UserService {
	constructor() {
		this.model = sequelize.models.User;
	}

	async create(data, transaction) {
		const { rfc, email, ...userData } = data;

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

		if (!newUser) {
			throw boom.badImplementation('Error creating user');
		}

		// eslint-disable-next-line no-unused-vars
		const { password, ...userWithoutPassword } = newUser.toJSON(); // Destructuring
		return userWithoutPassword;
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
				const normalizedEmail = this.model.normalizeEmail(updateData.email);
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
				const normalizedRoleName = models.Role.normalizeName(updateData.role);
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

			if (!updatedUser) {
				throw boom.badImplementation('Error updating user');
			}

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

			const deletedUser = await user.destroy({ transaction });

			if (!deletedUser) {
				throw boom.badImplementation('Error deleting user');
			}

			await transaction.commit();
			return { id: deletedUser.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async find() {
		const users = await this.model.findAll({
			attributes: { exclude: ['password'] },
		});

		if (!users) {
			throw boom.notFound('Users not found');
		}
		return users;
	}

	async findOne(id) {
		const user = await this.model.findByPk(id, {
			attributes: { exclude: ['password'] },
			include: [
				{
					model: models.Role,
					as: 'role',
				},
				{
					model: models.Company,
					as: 'company',
				},
			],
		});
		if (!user) {
			throw boom.notFound('User not found');
		}
		return user;
	}

	async findByEmail(email) {
		const normalizedEmail = this.model.normalizeEmail(email);

		const user = await this.model.findOne({
			where: { email: normalizedEmail },
		});

		if (!user) {
			throw boom.notFound('User not found');
		}

		return user;
	}
}

module.exports = UserService;
