const CompanyDTO = require('@dtos/company.dto');

class FindCompanyUseCase {
    constructor({ companyRepo }) {
        this.companyRepo = companyRepo;
    }

    async execute(id) {
        const company = await this.companyRepo.findById(id, {
            include: ['users'],
        });

        return CompanyDTO.fromDatabase(company);
    }
}

module.exports = FindCompanyUseCase;