const boom = require('@hapi/boom');
const { runInTransaction } = require('@utils/transaction.utils');

class DeleteUserUseCase {
    constructor({ userRepo }) {
        this.userRepo = userRepo;
    }

    async execute(id, transaction = null) {
        return runInTransaction(async (t) => {
            const userDeleted = await this.userRepo.delete(id, { transaction: t });

            if (userDeleted === 0) throw boom.notFound('Failed to delete user: No rows affected');

            return { id, message: 'User deleted successfully' };
        }, transaction);
    }
}

module.exports = DeleteUserUseCase;