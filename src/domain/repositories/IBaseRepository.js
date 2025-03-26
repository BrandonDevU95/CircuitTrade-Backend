class IBaseRepository {
    async find(options = {}) {
        throw new Error('Method not implemented.');
    }

    async findById(id, options = {}) {
        throw new Error('Method not implemented.');
    }

    async create(entity, options = {}) {
        throw new Error('Method not implemented.');
    }

    async update(id, entity, options = {}) {
        throw new Error('Method not implemented.');
    }

    async delete(id, options = {}) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IBaseRepository;
