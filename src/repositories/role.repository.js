const BaseRepository = require('./base.repository');

class RoleRepository extends BaseRepository {
    constructor(RoleModel) {
        super(RoleModel);
    }

    async findRoleByName(name, options = {}) {
        return await this.model.findOne({
            where: { name },
            ...options,
        });
    }
}

module.exports = RoleRepository;