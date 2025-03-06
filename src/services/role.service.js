const boom = require('@hapi/boom');
const sequelize = require('@db');

class RoleService {
	constructor() {
		this.model = sequelize.models.Role;
	}

	async create(data) {
		return sequelize.transaction(async (transaction) => {
			// Se utiliza el método helper normalizeName para obtener el nombre normalizado.
			const normalizedName = this.model.normalizeName(data.name);

			const [role] = await this.model.findOrCreate({
				where: { name: normalizedName },
				defaults: { ...data, name: normalizedName },
				transaction,
			});

			return role;
		});
	}

	async update(id, data) {
		return sequelize.transaction(async (transaction) => {
			const role = await this.model.findByPk(id, { transaction, rejectOnEmpty: boom.notFound('Role not found') });

			const updateData = { ...data };

			if ('name' in updateData) {
				const normalizedName = this.model.normalizeName(updateData.name);

				// Se verifica si el nuevo nombre es diferente al actual.
				if (normalizedName !== role.name) {
					const existingRole = await this.model.findOne({
						where: { name: normalizedName },
						transaction,
					});

					if (existingRole) throw boom.badRequest('Role already exists');

					updateData.name = normalizedName;
				} else {
					delete updateData.name;
				}
			}

			const [affectedCount] = await role.update(updateData, { transaction });

			if (affectedCount === 0) {
				throw boom.badImplementation('Failed to update role: No rows affected');
			}

			return role.reload({ transaction });
		});
	}

	async delete(id) {
		return sequelize.transaction(async (transaction) => {
			const deletedCount = await this.model.destroy({ where: { id }, transaction });

			if (deletedCount === 0) throw boom.badImplementation('Failed to delete role: No rows affected');

			return { id, message: 'Role deleted successfully' };
		});
	}

	async find() {
		const roles = await this.model.findAll();

		if (roles.length === 0) throw boom.notFound('Roles not found');

		return roles;
	}

	async findOne(id) {
		const role = await this.model.findByPk(id, {
			rejectOnEmpty: boom.notFound('Role not found'),
		});

		return role;
	}
}

module.exports = RoleService;
