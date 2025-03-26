const BaseRepository = require('./base.repository');

class CompanyRepository extends BaseRepository {
    constructor({ model }) {
        super({ model });
    }

    async findCompanyByRfc(rfc, options = {}) {
        return await this.model.findOne({
            where: { rfc },
            ...options,
        });
    }
}

module.exports = CompanyRepository;