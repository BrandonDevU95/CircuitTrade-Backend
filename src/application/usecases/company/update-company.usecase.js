const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const CompanyDTO = require('@application/dtos/company.dto');
const CompanyEntity = require('@domain/entities/company.entity');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class UpdateCompanyUseCase {
    constructor({ companyRepo }) {
        this.companyRepo = companyRepo;
    }

    async execute(id, data, transaction = null) {
        return runInTransaction(async (t) => {
            const entity = new CompanyEntity(data);
            const updateData = entity.prepareForUpdate(data);
            if (updateData.rfc || updateData.email) {
                const whereClause = { [Op.or]: [] };
                if (updateData.rfc) whereClause[Op.or].push({ rfc: updateData.rfc });
                if (updateData.email) whereClause[Op.or].push({ email: updateData.email });

                const existing = await this.companyRepo.find({ where: whereClause, transaction: t });
                entity.validateUniqueness(existing[0]);
            }

            const { affectedCount } = await this.companyRepo.update(id, updateData, {
                transaction: t,
            });

            if (affectedCount === 0) throw boom.notFound('Company not found');

            const updatedCompany = await this.companyRepo.findById(id, { transaction: t });
            return CompanyDTO.fromDatabase(updatedCompany);
        }, transaction);
    }
}

module.exports = UpdateCompanyUseCase;