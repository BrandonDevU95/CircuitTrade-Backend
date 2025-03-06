const boom = require('@hapi/boom');
const sequelize = require('@db');
const { runInTransaction } = require('@utils/transaction.utils');

class CompanyService {
	constructor() {
		this.companyModel = sequelize.models.Company;
		this.userModel = sequelize.models.User;
	}

	async create(data, transaction = null) {
		return runInTransaction(async (t) => {
			// Se usa la función helper para normalizar los campos
			const normalizedRfc = this.companyModel.normalizeRfc(data.rfc);
			const normalizedEmail = this.companyModel.normalizeEmail(data.email);

			// Verificación de duplicados para RFC
			const existing = await this.companyModel.findOne({
				where: {
					[sequelize.Op.or]: [
						{ rfc: normalizedRfc },
						{ email: normalizedEmail },
					],
				},
				transaction: t,
			});

			if (existing) {
				if (existing.rfc === normalizedRfc) throw boom.conflict('Company already exists with this RFC');
				if (existing.email === normalizedEmail) throw boom.conflict('Company already exists with this email');
			}
			// Preparar datos con campos normalizados
			const companyData = {
				...data,
				rfc: normalizedRfc,
				email: normalizedEmail,
			};

			return this.companyModel.create(companyData, {
				transaction: t,
			})
		}, transaction);
	}

	async update(id, data) {
		return sequelize.transaction(async (transaction) => {
			const company = await this.companyModel.findByPk(id, { transaction, rejectOnEmpty: boom.notFound('Company not found') });

			// Manejo condicional para actualizar campos de forma segura en actualizaciones parciales
			const updateData = { ...data };

			if ('rfc' in updateData) {
				const normalizedRfc = this.companyModel.normalizeRfc(updateData.rfc);

				if (normalizedRfc !== company.rfc) {
					// Verifica duplicados para RFC si se intenta cambiar
					const existingCompany = await this.companyModel.findOne({
						where: { rfc: normalizedRfc },
						transaction,
					});

					if (existingCompany) throw boom.conflict('Company already exists with this RFC');

					updateData.rfc = normalizedRfc;
				} else {
					delete updateData.rfc;
				}
			}

			if ('email' in updateData) {
				const normalizedEmail = this.companyModel.normalizeEmail(updateData.email);

				if (normalizedEmail !== company.email) {
					const existingCompanyEmail = await this.companyModel.findOne({
						where: { email: normalizedEmail },
						transaction,
					});

					if (existingCompanyEmail) throw boom.conflict('Company already exists with this email');

					updateData.email = normalizedEmail;
				} else {
					delete updateData.email;
				}

			}

			const [affectedCount] = await company.update(updateData, {
				transaction,
			});

			if (affectedCount === 0) throw boom.badImplementation('Failed to update company: No rows affected');

			return company.reload({ transaction });
		});
	}

	async delete(id) {
		return sequelize.transaction(async (transaction) => {
			const users = await this.userModel.findAll({
				where: { companyId: id },
				transaction,
			});

			if (users.length > 0) throw boom.badRequest('Cannot delete company with associated users');

			const deletedCount = await this.companyModel.destroy({ where: { id }, transaction });

			if (deletedCount === 0) throw boom.notFound('Failed to delete company: No rows affected');

			return { id, message: 'Company deleted successfully' };
		});
	}

	async find() {
		const companies = await this.companyModel.findAll();

		if (companies.length === 0) throw boom.notFound('Companies not found');

		return companies;
	}

	async findOne(id) {
		const company = await this.companyModel.findByPk(id, {
			rejectOnEmpty: boom.notFound('Company not found'),
		});

		return company;
	}
}

module.exports = CompanyService;
