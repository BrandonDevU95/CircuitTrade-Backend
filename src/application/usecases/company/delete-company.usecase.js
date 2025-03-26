const boom = require('@hapi/boom');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class DeleteCompanyUseCase {
    constructor({ companyRepo, userRepo }) {
        this.companyRepo = companyRepo;
        this.userRepo = userRepo;
    }

    async execute(id, transaction = null) {
        return runInTransaction(async (t) => {
            const users = await this.userRepo.find({ where: { companyId: id }, transaction: t });

            if (users.length > 0) throw boom.badRequest('Cannot delete company with associated users');

            const companyDeleted = await this.companyRepo.delete(id, { transaction: t });
            if (companyDeleted === 0) throw boom.notFound('Failed to delete company: No rows affected');

            return { id, message: 'Company deleted successfully' };
        }, transaction);
    }
}

module.exports = DeleteCompanyUseCase;