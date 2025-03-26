const boom = require('@hapi/boom');
const RoleDTO = require('@dtos/role.dto');
const RoleEntity = require('@entities/role.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class UpdateRoleUseCase {
    constructor({ roleRepo }) {
        this.roleRepo = roleRepo;
    }

    async execute(id, data, transaction = null) {
        return runInTransaction(async (t) => {
            const entity = new RoleEntity(data);
            const updateData = entity.prepareForUpdate(data);

            if (updateData.name) {
                const existing = await this.roleRepo.findRoleByName(updateData.name, { transaction: t });
                if (existing && Number(existing.id) !== Number(id)) entity.validateUniqueness(existing);
            }

            const { affectedCount } = await this.roleRepo.update(id, updateData, {
                transaction: t,
                returning: true
            });

            if (affectedCount === 0) throw boom.notFound('Role not updated');
            const updatedRole = await this.roleRepo.findById(id, { transaction: t });
            return RoleDTO.fromDatabase(updatedRole);
        }, transaction);
    }
}

module.exports = UpdateRoleUseCase;