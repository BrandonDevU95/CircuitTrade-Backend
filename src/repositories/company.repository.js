const boom = require('@hapi/boom');
const BaseRepository = require('./base.repository');

class CompanyRepository extends BaseRepository {
    constructor(CompanyModel) {
        super(CompanyModel);
    }

    async findCompanyByRfc(rfc, options = {}) {
        return await this.model.findOne({
            where: { rfc },
            ...options,
            rejectOnEmpty: boom.notFound(`${this.model.name} not found`),
        });
    }
}

module.exports = CompanyRepository;