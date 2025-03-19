const boom = require('@hapi/boom');
const CompanyDTO = require('@dtos/company.dto');
const CompanyEntity = require('@entities/company.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class CompanyService {
	constructor({ companyRepo, userRepo }) {
		this.companyRepo = companyRepo;
		this.userRepo = userRepo;
	}


	async find() {
		const companies = await this.companyRepo.find();

		if (companies.length === 0) throw boom.notFound('Companies not found');

		return companies.map(c => CompanyDTO.fromDatabase(c));
	}

	async findOne(id) {
		const company = await this.companyRepo.findById(id, {
			include: ['users'],
		});

		return CompanyDTO.fromDatabase(company);
	}

	async create(data, transaction = null) {
		return runInTransaction(async (t) => {
			const entity = new CompanyEntity(data);

			const existing = await this.companyRepo.find({
				where: {
					[this.companyRepo.model.sequelize.Op.or]: [
						{ rfc: entity._normalized.rfc },
						{ email: entity._normalized.email }
					]
				},
				transaction: t,
			});

			entity.validateUniqueness(existing[0]);
			const companyData = entity.prepareForCreate();
			const newCompany = await this.companyRepo.create(companyData, { transaction: t });
			return CompanyDTO.fromDatabase(newCompany);
		}, transaction);
	}

	async update(id, data, transaction = null) {
		return runInTransaction(async (t) => {
			const entity = new CompanyEntity(data);
			const updateData = entity.prepareForUpdate(data);
			if (updateData.rfc || updateData.email) {
				const whereClause = { [this.companyRepo.model.sequelize.Op.or]: [] };
				if (updateData.rfc) whereClause[this.companyRepo.model.sequelize.Op.or].push({ rfc: updateData.rfc });
				if (updateData.email) whereClause[this.companyRepo.model.sequelize.Op.or].push({ email: updateData.email });

				const existing = await this.companyRepo.find({ where: whereClause, transaction: t });
				entity.validateUniqueness(existing[0]);
			}

			const { affectedCount } = await this.companyRepo.update(id, updateData, {
				transaction: t,
				returning: true,
				individualHooks: true
			});

			if (affectedCount === 0) throw boom.notFound('Company not found');

			const updatedCompany = await this.companyRepo.findById(id, { transaction: t });
			return CompanyDTO.fromDatabase(updatedCompany);
		}, transaction);
	}

	async delete(id, transaction = null) {
		return runInTransaction(async (t) => {
			const users = await this.userRepo.find({ where: { companyId: id }, transaction: t });

			if (users.length > 0) throw boom.badRequest('Cannot delete company with associated users');

			const companyDeleted = await this.companyRepo.delete(id, { transaction: t });
			if (companyDeleted === 0) throw boom.notFound('Failed to delete company: No rows affected');

			return { id, message: 'Company deleted successfully' };
		}, transaction);
	}
}

module.exports = CompanyService;
