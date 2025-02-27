const UserService = require('./user.service');
const CompanyService = require('./company.service');
const RefreshTokenService = require('./refreshToken.service');
const JWTManager = require('../utils/jwt');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

class AuthService {
	constructor() {
		this.userService = new UserService();
		this.companyService = new CompanyService();
		this.refreshTokenService = new RefreshTokenService();
	}

	async getUser(email, password) {
		const user = await this.userService.findByEmail(email);

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

	async signUp(companyData, userData) {
		try {
			const company = await this.companyService.create(companyData);
			// Crear usuario vinculado a la empresa (usando el RFC de la empresa)
			const user = await this.userService.create(
				{ ...userData, rfc: company.rfc } // Envía el RFC de la empresa
			);

			const accessToken = JWTManager.generateAccessToken(user);
			const refreshToken = JWTManager.generateRefreshToken(user);

			await this.refreshTokenService.upsertRefreshToken(
				user.id,
				refreshToken
			);

			return { user, accessToken };
		} catch (error) {
			boom.boomify(error);
		}
	}
}

module.exports = AuthService;
