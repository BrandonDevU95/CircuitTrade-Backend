const UserService = require('./user.service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

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

		//El metodo get de un modelo de Sequelize devuelve un
		// objeto simple de JavaScript sin métodos ni propiedades adicionales de Sequelize.
		const { password: _, ...sanitizedUser } = user.get({ plain: true });
		return sanitizedUser;
	}
}

module.exports = AuthService;
