const boom = require('@hapi/boom');
const sequelize = require('@db');
const { runInTransaction } = require('@utils/transaction.utils');

class UserService {
	constructor() {
		this.userModel = sequelize.models.User;
		this.companyModel = sequelize.models.Company;
		this.roleModel = sequelize.models.Role;
	}

	async create(data, transaction = null) {
		return runInTransaction(async (t) => {
			const { rfc, email, ...userData } = data;

			// Se utiliza el método helper 'normalizeEmail' para obtener el email normalizado
			const normalizedEmail = this.userModel.normalizeEmail(email);
			const normalizedRfc = rfc.toUpperCase();
			const normalizedRoleName = this.roleModel.normalizeName(userData.role);

			// Prevención de duplicados por email
			const existingUser = await this.userModel.findOne({
				where: { email: normalizedEmail },
				transaction: t,
			});

			if (existingUser) throw boom.badRequest('User already exists');

			const company = await this.companyModel.findOne({
				where: { rfc: normalizedRfc },
				transaction: t,
				rejectOnEmpty: boom.notFound('Company not found')
			});

			const role = await this.roleModel.findOne({
				where: { name: normalizedRoleName },
				transaction: t,
				rejectOnEmpty: boom.notFound('Role not found')
			});

			const newUser = await this.userModel.create(
				{
					...userData,
					email: normalizedEmail,
					companyId: company.id,
					roleId: role.id,
				},
				{ transaction: t }
			);

			// eslint-disable-next-line no-unused-vars
			const { password, ...userWithoutPassword } = newUser.toJSON(); // Destructuring
			return userWithoutPassword;
		}, transaction);
	}

	async update(id, data) {
		return sequelize.transaction(async (transaction) => {
			const user = await this.userModel.findByPk(id, { transaction, rejectOnEmpty: boom.notFound('User not found') });

			// Se utiliza un objeto 'updateData' para procesar actualizaciones parciales
			const updateData = { ...data };

			// Solo se procesa la normalización y verificación de duplicados si 'email' está presente
			if ('email' in updateData) {
				const normalizedEmail = this.userModel.normalizeEmail(updateData.email);

				if (normalizedEmail !== user.email) {
					const existingUser = await this.userModel.findOne({
						where: { email: normalizedEmail },
						transaction,
					});

					if (existingUser) throw boom.badRequest('User already exists');

					updateData.email = normalizedEmail;
				} else {
					delete updateData.email;
				}
			}

			if ('role' in updateData) {
				const normalizedRoleName = this.roleModel.normalizeName(updateData.role);

				if (normalizedRoleName !== user.role.name) {
					const role = await this.roleModel.findOne({
						where: { name: normalizedRoleName },
						transaction,
						rejectOnEmpty: boom.notFound('Role not found'),
					});

					updateData.roleId = role.id;
					delete updateData.role;
				} else {
					delete updateData.role;
				}
			}

			const [affectedCount] = await user.update(updateData, { transaction });

			if (affectedCount === 0) throw boom.badRequest('Failed to update user: No rows affected');

			return user.reload({
				transaction,
				attributes: { exclude: ['password'] },
				include: [
					{
						model: this.roleModel,
						as: 'role',
					},
					{
						model: this.companyModel,
						as: 'company',
					},
				],
			});
		});
	}

	async delete(id) {
		return sequelize.transaction(async (transaction) => {
			const deletedCount = await this.userModel.destroy({ where: { id }, transaction });

			if (deletedCount === 0) throw boom.notFound('Failed to delete user: No rows affected');

			return { id, message: 'User deleted successfully' };
		});
	}

	async find() {
		const users = await this.userModel.findAll({
			attributes: { exclude: ['password'] },
		});

		if (users.length === 0) throw boom.notFound('Users not found');

		return users;
	}

	async findOne(id) {
		const user = await this.userModel.findByPk(id, {
			attributes: { exclude: ['password'] },
			include: [
				{
					model: this.roleModel,
					as: 'role',
				},
				{
					model: this.companyModel,
					as: 'company',
				},
			],
			rejectOnEmpty: boom.notFound('User not found'),
		});

		return user;
	}

	async findByEmail(email) {
		return sequelize.transaction(async (transaction) => {
			const normalizedEmail = this.userModel.normalizeEmail(email);

			const user = await this.userModel.findOne({
				where: { email: normalizedEmail },
				transaction,
				rejectOnEmpty: boom.notFound('User not found'),
			});

			return user;
		});
	}
}

module.exports = UserService;
