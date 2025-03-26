const boom = require('@hapi/boom');
const AuthDTO = require('@application/dtos/auth.dto');
const AuthEntity = require('@domain/entities/auth.entity');
const { verifyPassword } = require('@infrastructure/utils/auth.utils');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class SignInUseCase {
    constructor({
        userRepo,
        tokenService,
        upsertTokenUseCase,
    }) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
        this.upsertToken = upsertTokenUseCase
    }

    async execute(email, password, transaction = null) {
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
            await this.upsertToken.execute(user.id, refreshToken, t);

            return AuthDTO.fromService({
                ...user.get({ plain: true }),
                accessToken,
                refreshToken
            });
        }, transaction);
    }
}

module.exports = SignInUseCase;