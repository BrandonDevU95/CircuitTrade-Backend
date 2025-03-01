const UserService = require('./user.service');
const CompanyService = require('./company.service');
const RefreshTokenService = require('./refreshToken.service');
const JWTManager = require('../utils/jwt.utils');
const boom = require('@hapi/boom');
const { verifyPassword } = require('../utils/auth.utils');
const sequelize = require('../lib/sequelize');
class AuthService {
	constructor() {
		this.userService = new UserService();
		this.companyService = new CompanyService();
		this.refreshTokenService = new RefreshTokenService();
	}

	async getUser(email, password) {
		const user = await this.userService.findByEmail(email);

		if (!user.isActive) {
			throw boom.unauthorized('User is not active');
		}

		//Centralizar la logica de comparacion de contraseñas
		const isMatch = await verifyPassword(password, user.password);

		if (!isMatch) {
			throw boom.unauthorized('Invalid email or password');
		}

		//El metodo get de un modelo de Sequelize devuelve un
		// objeto simple de JavaScript sin métodos ni propiedades adicionales de Sequelize.
		// eslint-disable-next-line no-unused-vars
		const { password: _, ...sanitizedUser } = user.get({ plain: true });
		return sanitizedUser;
	}

	async signUp(companyData, userData) {
		const transaction = await sequelize.transaction();
		try {
			const company = await this.companyService.create(companyData, transaction);

			// Crear usuario vinculado a la empresa (usando el RFC de la empresa)
			const user = await this.userService.create(
				{ ...userData, rfc: company.rfc }, // Envía el RFC de la empresa
				transaction
			);

			const accessToken = JWTManager.generateAccessToken(user);
			const refreshToken = JWTManager.generateRefreshToken(user);

			if (!accessToken || !refreshToken) {
				throw boom.badImplementation('Error generating tokens');
			}

			await this.refreshTokenService.upsertRefreshToken(user.id, refreshToken, transaction);

			await transaction.commit();
			return { user, accessToken };
		} catch (error) {
			await transaction.rollback();

			if (boom.isBoom(error)) {
				throw error;
			}

			throw error;
		}
	}
}

module.exports = AuthService;
