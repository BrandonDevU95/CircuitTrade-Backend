const boom = require('@hapi/boom');
const { runInTransaction } = require('@utils/transaction.utils');

class DeleteRoleUseCase {
    constructor({ roleRepo }) {
        this.roleRepo = roleRepo;
    }

    async execute(id, transaction = null) {
        return runInTransaction(async (t) => {
            const roleDeleted = await this.roleRepo.delete(id, { transaction: t });
            if (roleDeleted === 0) throw boom.notFound('Failed to delete role: No rows affected');
            return { id, message: 'Role deleted successfully' };
        }, transaction);
    }
}

module.exports = DeleteRoleUseCase;