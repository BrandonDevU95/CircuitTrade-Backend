const RoleDTO = require('@application/dtos/role.dto');
const RoleEntity = require('@domain/entities/role.entity');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class CreateRoleUseCase {
    constructor({ roleRepo }) {
        this.roleRepo = roleRepo;
    }

    async execute(data, transaction = null) {
        return runInTransaction(async (t) => {
            const entity = new RoleEntity(data);

            const existing = await this.roleRepo.findRoleByName(entity._normalized.name, { transaction: t });

            entity.validateUniqueness(existing);

            const roleData = entity.prepareForCreate();
            const newRole = await this.roleRepo.create(roleData, { transaction: t });
            return RoleDTO.fromDatabase(newRole);
        }, transaction);
    }
}

module.exports = CreateRoleUseCase;