const boom = require('@hapi/boom');
const sequelize = require('../lib/sequelize');

const { models } = require('./../lib/sequelize');

class CompanyService {
	constructor() {
		this.model = models.Company;
	}

	async create(data) {
		const transaction = await sequelize.transaction();
		const { rfc, email, ...companyData } = data;
		const emailLower = email.toLowerCase();
		const rfcUpper = rfc.toUpperCase();

		try {
			const existingCompany = await this.model.findOne({
				where: { rfc: rfcUpper },
				transaction,
			});

			if (existingCompany) {
				throw boom.conflict('Company already exists with this RFC');
			}

			const newCompany = await this.model.create(
				{ ...companyData, rfc: rfcUpper, email: emailLower },
				{ transaction }
			);

			await transaction.commit();
			return newCompany;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update(id, data) {
		const transaction = await sequelize.transaction();
		try {
			const company = await this.model.findByPk(id, { transaction });

			if (!company) {
				throw boom.notFound('company not found');
			}

			const updatedCompany = await company.update(data);
			await transaction.commit();
			return updatedCompany;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(id) {
		const company = await this.model.findByPk(id);
		if (!company) {
			throw boom.notFound('company not found');
		}

		await company.destroy();
		return { id };
	}

	async find() {
		const companies = await this.model.findAll();
		return companies;
	}

	async findOne(id) {
		const company = await this.model.findByPk(id);
		if (!company) {
			throw boom.notFound('company not found');
		}

		return company;
	}
}

module.exports = CompanyService;
