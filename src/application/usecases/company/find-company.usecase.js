const boom = require('@hapi/boom');
const CompanyDTO = require('@application/dtos/company.dto');

class FindCompanyUseCase {
    constructor({ companyRepo }) {
        this.companyRepo = companyRepo;
    }

    async execute(id) {
        const company = await this.companyRepo.findById(id, {
            rejectOnEmpty: boom.notFound('Company not found')
        });

        return CompanyDTO.fromDatabase(company);
    }
}

module.exports = FindCompanyUseCase;