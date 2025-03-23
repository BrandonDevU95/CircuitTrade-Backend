const boom = require('@hapi/boom');
const UserDTO = require('@dtos/user.dto');
const UserEntity = require('@entities/user.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class UserService {
	constructor({ userRepo, companyRepo, roleRepo }) {
		this.userRepo = userRepo;
		this.companyRepo = companyRepo;
		this.roleRepo = roleRepo;
	}

	async find() {
		const users = await this.userRepo.findUsersSafe({
			order: [['createdAt', 'DESC']],
		});

		//NOTA: rejectOnEmpty no funciona en el metodo find de sequelize
		if (users.length === 0) throw boom.notFound('Users not found');

		return users
	}

	async findOne(id) {
		const user = await this.userRepo.findUserByIdWithDetails(id);

		return UserDTO.fromDatabase(user);
	}

	async create(data, transaction = null) {
		return runInTransaction(async (t) => {
			const userEntity = new UserEntity(data);

			// Prevención de duplicados por email
			await this.validateUniqueEmail(userEntity._normalized.email, null, t);

			const [company, role] = await Promise.all([
				this.companyRepo.findCompanyByRfc(userEntity._normalized.rfc, { transaction: t }),
				this.roleRepo.findRoleByName(userEntity._normalized.role, { transaction: t })
			]);

			if (!company || !role) throw boom.notFound(company ? 'Role not found' : 'Company not found');

			const newUserData = {
				...await userEntity.prepareForCreate(),
				companyId: company.id,
				roleId: role.id
			};

			const newUser = await this.userRepo.create(newUserData, { transaction: t });

			return UserDTO.fromDatabase(newUser);
		}, transaction);
	}

	async update(id, data, transaction = null) {
		return runInTransaction(async (t) => {
			const userEntity = new UserEntity(data);
			const updateData = userEntity.prepareForUpdate(data);
			const currentUser = await this.userRepo.findById(id, { transaction: t });

			// Validar email único
			if (updateData.email) {
				await this.validateUniqueEmail(updateData.email, currentUser.id, t);
			}

			// Actualizar rol si aplica
			if (updateData.role) {
				updateData.roleId = await this.handleRoleUpdate(updateData.role, t);
				delete updateData.role;
			}

			// Actualizar password si aplica
			if (updateData.currentPassword || updateData.newPassword) {
				const { password } = await userEntity.prepareForPasswordUpdate(
					updateData.currentPassword,
					currentUser.password,
					updateData.newPassword
				);

				updateData.password = password;
				delete updateData.currentPassword;
				delete updateData.newPassword;
			}

			const { affectedCount } = await this.userRepo.update(currentUser.id, updateData, { transaction: t });

			if (affectedCount === 0) return { id, message: 'User not updated' };

			const updatedUser = await this.userRepo.findUserByIdWithDetails(currentUser.id, { transaction: t });

			return UserDTO.fromDatabase(updatedUser);
		}, transaction);
	}

	async delete(id, transaction = null) {
		return runInTransaction(async (t) => {
			const userDeleted = await this.userRepo.delete(id, { transaction: t });

			if (userDeleted === 0) throw boom.notFound('Failed to delete user: No rows affected');

			return { id, message: 'User deleted successfully' };
		}, transaction);
	}

	async findByEmail(email, transaction = null) {
		return runInTransaction(async (t) => {
			const userEntity = new UserEntity({ email });
			const user = await this.userRepo.findUserByEmail(userEntity._normalized.email, { transaction: t });

			return UserDTO.fromDatabase(user);
		}, transaction);
	}

	async validateUniqueEmail(email, userId, transaction) {
		const existingUser = await this.userRepo.findUserByEmail(email, { transaction });
		if (existingUser && existingUser.id !== userId) {
			throw boom.conflict('Email already registered to another user');
		}
	}

	async handleRoleUpdate(roleName, transaction) {
		const role = await this.roleRepo.findRoleByName(roleName, { transaction });
		if (!role) throw boom.notFound('Specified role does not exist');
		return role.id;
	}
}

module.exports = UserService;
