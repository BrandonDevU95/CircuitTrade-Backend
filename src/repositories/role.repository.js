const boom = require('@hapi/boom');
const BaseRepository = require('./base.repository');

class RoleRepository extends BaseRepository {
    constructor(RoleModel) {
        super(RoleModel);
    }

    async findRoleByName(name, options = {}) {
        return await this.model.findOne({
            where: { name },
            ...options,
            rejectOnEmpty: boom.notFound(`${this.model.name} not found`),
        });
    }
}

module.exports = RoleRepository;