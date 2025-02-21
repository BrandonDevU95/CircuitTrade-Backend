const UserService = require('./user.service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

const service = new UserService();

class AuthService {
	async getUser(email, password) {
		const user = await service.findByEmail(email);

		if (!user || !user.isActive) {
			throw boom.unauthorized('Invalid email or password');
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw boom.unauthorized('Invalid email or password');
		}

		return user;
	}
}

module.exports = AuthService;
