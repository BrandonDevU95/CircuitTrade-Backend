const boom = require('@hapi/boom');
const sequelize = require('../db');

class CompanyService {
	constructor() {
		this.model = sequelize.models.Company;
	}

	async create(data, transaction) {
		// Se usa la función helper para normalizar los campos
		const normalizedRfc = this.model.normalizeRfc(data.rfc);
		const normalizedEmail = this.model.normalizeEmail(data.email);

		// Verificación de duplicados para RFC
		const existingCompany = await this.model.findOne({
			where: { rfc: normalizedRfc },
			transaction,
		});
		if (existingCompany) {
			throw boom.conflict('Company already exists with this RFC');
		}

		const existingCompanyEmail = await this.model.findOne({
			where: { email: normalizedEmail },
			transaction,
		});
		if (existingCompanyEmail) {
			throw boom.conflict('Company already exists with this email');
		}

		// Preparar datos con campos normalizados
		const companyData = {
			...data,
			rfc: normalizedRfc,
			email: normalizedEmail,
		};

		const newCompany = await this.model.create(companyData, {
			transaction,
		});

		if (!newCompany) {
			throw boom.badImplementation('Error creating company');
		}

		return newCompany;
	}

	async update(id, data) {
		const transaction = await sequelize.transaction();
		try {
			const company = await this.model.findByPk(id, { transaction });

			if (!company) {
				throw boom.notFound('Company not found');
			}

			// Manejo condicional para actualizar campos de forma segura en actualizaciones parciales
			const updateData = { ...data };

			if (updateData.rfc !== undefined) {
				const normalizedRfc = this.model.normalizeRfc(updateData.rfc);
				if (normalizedRfc !== company.rfc) {
					// Verifica duplicados para RFC si se intenta cambiar
					const existingCompany = await this.model.findOne({
						where: { rfc: normalizedRfc },
						transaction,
					});
					if (existingCompany) {
						throw boom.conflict('Company already exists with this RFC');
					}
				}
				updateData.rfc = normalizedRfc;
			}

			if (updateData.email !== undefined) {
				const normalizedEmail = this.model.normalizeEmail(updateData.email);
				if (normalizedEmail !== company.email) {
					const existingCompanyEmail = await this.model.findOne({
						where: { email: normalizedEmail },
						transaction,
					});
					if (existingCompanyEmail) {
						throw boom.conflict('Company already exists with this email');
					}
				}
				updateData.email = normalizedEmail;
			}

			const updatedCompany = await company.update(updateData, {
				transaction,
			});

			if (!updatedCompany) {
				throw boom.badImplementation('Error updating company');
			}

			await transaction.commit();
			return updatedCompany;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(id) {
		const transaction = await sequelize.transaction();
		try {
			const company = await this.model.findByPk(id, { transaction });

			if (!company) {
				throw boom.notFound('Company not found');
			}

			const users = await models.User.findAll({
				where: { companyId: id },
				transaction,
			});

			if (users.length > 0) {
				throw boom.badRequest('Cannot delete company with associated users');
			}

			const deletedCompany = await company.destroy({ transaction });

			if (!deletedCompany) {
				throw boom.badImplementation('Error deleting company');
			}

			await transaction.commit();
			return { id: deletedCompany.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async find() {
		const companies = await this.model.findAll();

		if (!companies) {
			throw boom.notFound('Companies not found');
		}

		return companies;
	}

	async findOne(id) {
		const company = await this.model.findByPk(id);

		if (!company) {
			throw boom.notFound('Company not found');
		}
		return company;
	}
}

module.exports = CompanyService;
