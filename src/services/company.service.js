const boom = require('@hapi/boom');

const { models } = require('./../lib/sequelize');

class CompanyService {
	constructor() {
		this.model = models.Company;
	}

	async create(data) {
		const newCompany = await this.model.create(data);
		return newCompany;
	}

	async update(id, data) {
		const company = await this.model.findByPk(id);
		if (!company) {
			throw boom.notFound('company not found');
		}

		const updatedCompany = await company.update(data);
		return updatedCompany;
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
