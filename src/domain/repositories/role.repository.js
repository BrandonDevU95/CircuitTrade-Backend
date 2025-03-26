const BaseRepository = require('./base.repository');

class RoleRepository extends BaseRepository {
    constructor({ model }) {
        super({ model });
    }

    async findRoleByName(name, options = {}) {
        return await this.model.findOne({
            where: { name },
            ...options,
        });
    }
}

module.exports = RoleRepository;