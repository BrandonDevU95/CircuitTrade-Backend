const boom = require('@hapi/boom');

const { models } = require('./../lib/sequelize');

class RoleService {
	constructor() {
		this.model = models.Role;
	}

	async create(data) {
		const nameLower = data.name.toLowerCase();

		const existingRole = await this.model.findOne({
			where: {
				name: nameLower,
			},
		});

		if (existingRole) {
			throw boom.badRequest('role already exists');
		}

		const newRole = await this.model.create({
			...data,
			name: nameLower,
		});
		return newRole;
	}

	async update(id, data) {
		const role = await this.model.findByPk(id);
		if (!role) {
			throw boom.notFound('role not found');
		}

		const updatedRole = await role.update(data);
		return updatedRole;
	}

	async delete(id) {
		const role = await this.model.findByPk(id);
		if (!role) {
			throw boom.notFound('role not found');
		}

		await role.destroy();
		return { id };
	}

	async find() {
		const roles = await this.model.findAll();
		return roles;
	}

	async findOne(id) {
		const role = await this.model.findByPk(id);
		if (!role) {
			throw boom.notFound('role not found');
		}

		return role;
	}
}

module.exports = RoleService;
