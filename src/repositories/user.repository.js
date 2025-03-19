const boom = require('@hapi/boom');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
    constructor({ model }) {
        super({ model });
    }

    async findUsersSafe(options = {}) {
        return this.model.findAll({
            ...options,
            attributes: { exclude: ['password'] },
            rejectOnEmpty: boom.notFound(`${this.model.name} not found`),
        });
    }

    async findUserByEmail(email, options = {}) {
        return await this.model.findOne({
            where: { email },
            ...options,
        });
    }

    async findUserByIdWithDetails(id, options = {}) {
        return this.model.findByPk(id, {
            include: ['role', 'company'],
            attributes: { exclude: ['password'] },
            rejectOnEmpty: boom.notFound(`${this.model.name} not found`),
            ...options
        });
    }
}

module.exports = UserRepository;