const boom = require('@hapi/boom');
const AuthDTO = require('@application/dtos/auth.dto');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class UserInfoUseCase {
    constructor({ userRepo }) {
        this.userRepo = userRepo;
    }

    async execute(userId, transaction = null) {
        return runInTransaction(async (t) => {
            const user = await this.userRepo.findUserByIdWithDetails(userId, { transaction: t });

            if (!user) throw boom.notFound('User not found');

            return AuthDTO.fromModel(user.get({ plain: true }));
        }, transaction);
    }

}

module.exports = UserInfoUseCase;