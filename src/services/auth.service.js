const boom = require('@hapi/boom');
const AuthDTO = require('@dtos/auth.dto');
const AuthEntity = require('@entities/auth.entity');
const { verifyPassword } = require('@utils/auth.utils');
const { runInTransaction } = require('@utils/transaction.utils');

class AuthService {
	constructor({
		userRepo,
		companyRepo,
		roleRepo,
		tokenService,
		refreshTokenService
	}) {
		this.userRepo = userRepo;
		this.companyRepo = companyRepo;
		this.roleRepo = roleRepo;
		this.tokenService = tokenService;
		this.refreshTokenService = refreshTokenService;
	}

	async signUp(rawCompanyData, rawUserData, transaction = null) {
		return runInTransaction(async (t) => {
			const authEntity = new AuthEntity(rawCompanyData, rawUserData);
			const { company: companyData, user: userData } = await authEntity.prepareForCreate();

			const existingCompany = await this.companyRepo.find({
				where: {
					[this.companyRepo.model.sequelize.Op.or]: [
						{ rfc: authEntity._normalized.company.rfc },
						{ email: authEntity._normalized.company.email }
					]
				},
				transaction: t
			});

			authEntity.validateCompanyUniqueness(existingCompany[0]);

			const existingUser = await this.userRepo.findUserByEmail(
				authEntity._normalized.user.email,
				{ transaction: t }
			);

			authEntity.validateUserUniqueness(existingUser);


			const company = await this.companyRepo.create(companyData, { transaction: t });

			const role = await this.roleRepo.findRoleByName(
				authEntity._normalized.user.role,
				{ transaction: t }
			);

			const user = await this.userRepo.create({
				...userData,
				companyId: company.id,
				roleId: role.id
			}, { transaction: t });

			const { accessToken, refreshToken } = this.tokenService.generateTokens(user);

			await this.refreshTokenService.upsertRefreshToken(user.id, refreshToken, t);

			return AuthDTO.fromService({
				...user.get({ plain: true }),
				accessToken
			});
		}, transaction);
	}

	async authenticate(email, password, transaction = null) {
		return runInTransaction(async (t) => {
			const authEntity = new AuthEntity({}, { email, password });
			const user = await this.userRepo.findUserByEmail(
				authEntity._normalized.user.email,
				{ transaction: t }
			);

			if (!user) throw boom.unauthorized('Invalid credentials');
			if (!user.isActive) throw boom.unauthorized('User is inactive');

			const isValid = await verifyPassword(
				authEntity.userData.password,
				user.password
			);
			if (!isValid) throw boom.unauthorized('Invalid credentials');

			const { accessToken, refreshToken } = this.tokenService.generateTokens(user);
			await this.refreshTokenService.upsertRefreshToken(user.id, refreshToken, t);

			return AuthDTO.fromService({
				...user.get({ plain: true }),
				accessToken
			});
		}, transaction);
	}

}

module.exports = AuthService;