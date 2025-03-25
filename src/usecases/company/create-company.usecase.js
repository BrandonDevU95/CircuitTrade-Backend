const { Op } = require('sequelize');
const CompanyDTO = require('@dtos/company.dto');
const CompanyEntity = require('@entities/company.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class CreateCompanyUsecase {
    constructor({ companyRepo }) {
        this.companyRepo = companyRepo;
    }

    async execute(data, transaction = null) {
        return runInTransaction(async (t) => {
            const entity = new CompanyEntity(data);

            const existing = await this.companyRepo.find({
                where: {
                    [Op.or]: [
                        { rfc: entity._normalized.rfc },
                        { email: entity._normalized.email }
                    ]
                },
                transaction: t,
            });

            entity.validateUniqueness(existing[0]);
            const companyData = entity.prepareForCreate();
            const newCompany = await this.companyRepo.create(companyData, { transaction: t });
            return CompanyDTO.fromDatabase(newCompany);
        }, transaction);
    }
}

module.exports = CreateCompanyUsecase;