const { Op } = require('sequelize');
const AuthDTO = require('@dtos/auth.dto');
const AuthEntity = require('@entities/auth.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class SignUpUseCase {
    constructor({
        userRepo,
        companyRepo,
        roleRepo,
        tokenService,
        upsertTokenUseCase,
    }) {
        this.userRepo = userRepo;
        this.companyRepo = companyRepo;
        this.roleRepo = roleRepo;
        this.tokenService = tokenService;
        this.upsertToken = upsertTokenUseCase
    }

    async execute(rawCompanyData, rawUserData, transaction = null) {
        return runInTransaction(async (t) => {
            const authEntity = new AuthEntity(rawCompanyData, rawUserData);
            const { company: companyData, user: userData } = await authEntity.prepareForCreate();

            const existingCompany = await this.companyRepo.find({
                where: {
                    [Op.or]: [
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

            const existingRole = await this.roleRepo.findRoleByName(
                authEntity._normalized.user.role,
                { transaction: t }
            );

            authEntity.validateRoleExistence(existingRole);


            const company = await this.companyRepo.create(companyData, { transaction: t });

            const user = await this.userRepo.create({
                ...userData,
                companyId: company.id,
                roleId: existingRole.id
            }, { transaction: t });

            const { accessToken, refreshToken } = this.tokenService.generateTokens(user);

            await this.upsertToken.execute(user.id, refreshToken, t);

            return AuthDTO.fromService({
                ...user.get({ plain: true }),
                accessToken,
                refreshToken
            });
        }, transaction);
    }
}

module.exports = SignUpUseCase;