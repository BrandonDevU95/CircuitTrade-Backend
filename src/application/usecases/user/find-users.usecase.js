const boom = require('@hapi/boom');

class FindUsersUseCase {
    constructor({ userRepo }) {
        this.userRepo = userRepo;
    }

    async execute() {
        const users = await this.userRepo.findUsersSafe({
            order: [['createdAt', 'DESC']],
        });

        if (users.length === 0) throw boom.notFound('Users not found');
        return users
    }
}

module.exports = FindUsersUseCase;

