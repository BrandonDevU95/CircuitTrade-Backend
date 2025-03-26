const boom = require('@hapi/boom');
const CompanyDTO = require('@dtos/company.dto');

class FindCompaniesUseCase {
    constructor({ companyRepo }) {
        this.companyRepo = companyRepo;
    }

    async execute() {
        const companies = await this.companyRepo.find({
            order: [['createdAt', 'DESC']],
        });

        //NOTA: rejectOnEmpty no funciona en el metodo find de sequelize
        if (companies.length === 0) throw boom.notFound('Companies not found');

        return companies.map(c => CompanyDTO.fromDatabase(c));
    }
}

module.exports = FindCompaniesUseCase;