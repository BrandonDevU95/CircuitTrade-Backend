const boom = require('@hapi/boom');

const { models } = require('./../lib/sequelize');

class userService {
	constructor() {
		this.model = models.User;
	}

	async create(data) {
		//TODO: Implementar transacciones para asegurar que se creen los usuarios y la empresa
		const { rfc, email, ...userData } = data;
		const emailLower = email.toLowerCase();
		const rfcUpper = rfc.toUpperCase();

		const existingUser = await this.model.findOne({
			where: {
				email: emailLower,
			},
		});

		if (existingUser) {
			throw boom.badRequest('user already exists');
		}

		const company = await models.Company.findOne({
			where: {
				rfc: rfcUpper,
			},
		});

		if (!company) {
			throw boom.badRequest('company not found');
		}

		const newUser = await this.model.create({
			...userData,
			email: emailLower,
			companyId: company.id,
		});

		return newUser;
	}

	async update(id, data) {
		const user = await this.model.findByPk(id);
		if (!user) {
			throw boom.notFound('user not found');
		}

		const updatedUser = await user.update(data);
		return updatedUser;
	}

	async delete(id) {
		const user = await this.model.findByPk(id);
		if (!user) {
			throw boom.notFound('user not found');
		}

		await user.destroy();
		return { id };
	}

	async find() {
		const users = await this.model.findAll();
		return users;
	}

	async findOne(id) {
		const user = await this.model.findByPk(id);
		if (!user) {
			throw boom.notFound('user not found');
		}
		return user;
	}
}

module.exports = userService;
