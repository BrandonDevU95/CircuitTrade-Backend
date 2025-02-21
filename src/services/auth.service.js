const UserService = require('./user.service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const service = new UserService();

class AuthService {
	async getUser(email, password) {
		const user = await service.findByEmail(email);

		if (!user) {
			throw boom.unauthorized('Invalid email or password');
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw boom.unauthorized('Invalid email or password');
		}

		delete user.dataValues.password;
		return user;
	}
}

module.exports = AuthService;
