const boom = require('@hapi/boom');
const sequelize = require('../db');

class RoleService {
	constructor() {
		this.model = sequelize.models.Role;
	}

	async create(data) {
		const transaction = await sequelize.transaction();
		try {
			// Se utiliza el método helper normalizeName para obtener el nombre normalizado.
			const normalizedName = this.model.normalizeName(data.name);

			const existingRole = await this.model.findOne({
				where: { name: normalizedName },
				transaction,
			});
			if (existingRole) {
				throw boom.badRequest('Role already exists');
			}

			const newRole = await this.model.create(
				{
					...data,
					name: normalizedName,
				},
				{ transaction }
			);

			if (!newRole) {
				throw boom.badImplementation('Error creating role');
			}

			await transaction.commit();
			return newRole;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update(id, data) {
		const transaction = await sequelize.transaction();
		try {
			const role = await this.model.findByPk(id, { transaction });

			if (!role) {
				throw boom.notFound('Role not found');
			}

			const updateData = { ...data };

			if (updateData.name !== undefined) {
				const normalizedName = this.model.normalizeName(updateData.name);
				const existingRole = await this.model.findOne({
					where: { name: normalizedName },
					transaction,
				});
				if (existingRole && existingRole.id !== id) {
					throw boom.badRequest('Role already exists');
				}
				updateData.name = normalizedName;
			}

			const updatedRole = await role.update(updateData, { transaction });

			if (!updatedRole) {
				throw boom.badImplementation('Error updating role');
			}

			await transaction.commit();
			return updatedRole;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(id) {
		const transaction = await sequelize.transaction();
		try {
			const role = await this.model.findByPk(id, { transaction });
			if (!role) {
				throw boom.notFound('Role not found');
			}

			const deletedRole = await role.destroy({ transaction });

			if (!deletedRole) {
				throw boom.badImplementation('Error deleting role');
			}

			await transaction.commit();
			return { id: deletedRole.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async find() {
		const roles = await this.model.findAll();

		if (!roles) {
			throw boom.notFound('Roles not found');
		}
		return roles;
	}

	async findOne(id) {
		const role = await this.model.findByPk(id);

		if (!role) {
			throw boom.notFound('Role not found');
		}
		return role;
	}
}

module.exports = RoleService;
