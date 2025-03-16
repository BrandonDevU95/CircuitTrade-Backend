const sequelize = require('@db');
const boom = require('@hapi/boom');
const UserService = require('./user.service');
const TokenService = require('./token.service');
const CompanyService = require('./company.service');
const { verifyPassword } = require('@utils/auth.utils');
const RefreshTokenService = require('./refreshToken.service');
class AuthService {
	constructor() {
		this.userService = new UserService();
		this.tokenService = new TokenService();
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
		return sequelize.transaction(async (transaction) => {
			const company = await this.companyService.create(companyData, transaction);

			// Crear usuario vinculado a la empresa (usando el RFC de la empresa)
			const user = await this.userService.create(
				{ ...userData, rfc: company.rfc }, // Envía el RFC de la empresa
				transaction
			);
			const { accessToken, refreshToken } = this.tokenService.generateTokens(user);

			await this.refreshTokenService.upsertRefreshToken(user.id, refreshToken, transaction);

			return { user, accessToken };
		});
	}
}

module.exports = AuthService;
3511193954