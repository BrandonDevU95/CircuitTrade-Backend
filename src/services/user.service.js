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
			const existingUser = await this.userRepo.findUserByEmail(
				userEntity._normalized.email,
				{ transaction: t }
			);

			userEntity.validateUniqueness(existingUser);

			const company = await this.companyRepo.findCompanyByRfc(
				userEntity._normalized.rfc,
				{ transaction: t }
			);
			const role = await this.roleRepo.findRoleByName(
				userEntity._normalized.role,
				{ transaction: t }
			);

			const userPayload = {
				...await userEntity.prepareForCreate(),
				companyId: company.id,
				roleId: role.id
			};

			const newUser = await this.userRepo.create(userPayload, { transaction: t });

			return UserDTO.fromDatabase(newUser);
		}, transaction);
	}

	async update(id, data, transaction = null) {
		return runInTransaction(async (t) => {
			const userEntity = new UserEntity(data);
			const updatePayload = await userEntity.prepareForUpdate(data);

			// Validar email si aplica
			if (updatePayload.email) {
				const existingUser = await this.userRepo.findUserByEmail(
					updatePayload.email,
					{ transaction: t }
				);

				if (existingUser && Number(existingUser.id) !== Number(id)) {
					userEntity.validateUniqueness(existingUser);
				}
			}

			// Actualizar rol si aplica
			if (updatePayload.role) {
				const role = await this.roleRepo.findRoleByName(
					userEntity._normalized.role,
					{ transaction: t }
				);
				updatePayload.roleId = role.id;
				delete updatePayload.role;
			}

			const { affectedCount } = await this.userRepo.update(id, updatePayload, { transaction: t });

			if (affectedCount === 0) return { id, message: 'User not updated' };

			const updatedUser = await this.userRepo.findUserByIdWithDetails(id, { transaction: t });

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
}

module.exports = UserService;
