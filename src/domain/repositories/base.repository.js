const boom = require('@hapi/boom');

class BaseRepository {
    constructor({ model }) {
        this.model = model;
    }

    async find(options = {}) {
        return this.model.findAll(options);
    }

    async findById(id, options = {}) {
        const record = await this.model.findByPk(id, {
            ...options,
            rejectOnEmpty: boom.notFound(`${this.model.name} not found`),
        });
        return record;
    }

    async create(entity, options = {}) {
        const newItem = await this.model.create(entity, options);
        return newItem;
    }

    async update(id, entity, options = {}) {
        const [affectedCount] = await this.model.update(entity, { where: { id }, ...options });
        return { affectedCount };
    }

    async delete(id, options = {}) {
        const itemDeleted = await this.model.destroy({
            where: { id },
            ...options,
        });
        return itemDeleted;
    }
}

module.exports = BaseRepository;