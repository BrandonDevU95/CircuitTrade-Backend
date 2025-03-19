const boom = require('@hapi/boom');
const RoleDTO = require('@dtos/role.dto');
const RoleEntity = require('@entities/role.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class RoleService {
	constructor({ roleRepo }) {
		this.roleRepo = roleRepo;
	}

	async find() {
		const roles = await this.roleRepo.find();

		//Considerar mover a la entidad
		if (roles.length === 0) throw boom.notFound('Roles not found');

		return roles.map(r => RoleDTO.fromDatabase(r));
	}

	async findOne(id) {
		const role = await this.roleRepo.findById(id);
		return RoleDTO.fromDatabase(role);
	}

	async create(data, transaction = null) {
		return runInTransaction(async (t) => {
			const entity = new RoleEntity(data);

			const existing = await this.roleRepo.findRoleByName(entity._normalized.name, { transaction: t });

			entity.validateUniqueness(existing);

			const roleData = entity.prepareForCreate();
			const newRole = await this.roleRepo.create(roleData, { transaction: t });
			return RoleDTO.fromDatabase(newRole);
		}, transaction);
	}

	async update(id, data, transaction = null) {
		return runInTransaction(async (t) => {
			const entity = new RoleEntity(data);
			const updateData = entity.prepareForUpdate(data);

			if (updateData.name) {
				const existing = await this.roleRepo.findRoleByName(updateData.name, { transaction: t });
				if (existing && existing.id !== id) entity.validateUniqueness(existing);
			}

			const { affectedCount } = await this.roleRepo.update(id, updateData, {
				transaction: t,
				returning: true
			});

			if (affectedCount === 0) throw boom.notFound('Role not found');
			const updatedRole = await this.roleRepo.findById(id, { transaction: t });
			return RoleDTO.fromDatabase(updatedRole);
		}, transaction);
	}

	async delete(id, transaction = null) {
		return runInTransaction(async (t) => {
			const roleDeleted = await this.roleRepo.delete(id, { transaction: t });
			if (roleDeleted === 0) throw boom.notFound('Failed to delete role: No rows affected');
			return { id, message: 'Role deleted successfully' };
		}, transaction);
	}
}

module.exports = RoleService;
