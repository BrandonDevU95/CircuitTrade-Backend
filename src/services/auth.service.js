const UserService = require('./user.service');
const CompanyService = require('./company.service');
const RefreshTokenService = require('./refreshToken.service');
const JWTManager = require('@utils/jwt.utils');
const boom = require('@hapi/boom');
const { verifyPassword } = require('@utils/auth.utils');
const sequelize = require('@db');
class AuthService {
	constructor() {
		this.userModel = new UserService();
		this.companyModel = new CompanyService();
		this.refreshTokenModel = new RefreshTokenService();
	}

	async getUser(email, password) {
		const user = await this.userModel.findByEmail(email);

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
			const company = await this.companyModel.create(companyData, transaction);

			// Crear usuario vinculado a la empresa (usando el RFC de la empresa)
			const user = await this.userModel.create(
				{ ...userData, rfc: company.rfc }, // Envía el RFC de la empresa
				transaction
			);

			const accessToken = JWTManager.generateAccessToken(user);
			const refreshToken = JWTManager.generateRefreshToken(user);

			if (!accessToken || !refreshToken) {
				throw boom.badImplementation('Error generating tokens');
			}

			await this.refreshTokenModel.upsertRefreshToken(user.id, refreshToken, transaction);

			return { user, accessToken };
		});
	}
}

module.exports = AuthService;
