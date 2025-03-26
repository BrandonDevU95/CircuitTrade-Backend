const UserDTO = require('@dtos/user.dto');

class FindUserUseCase {
    constructor({ userRepo }) {
        this.userRepo = userRepo;
    }

    async execute(id) {
        const user = await this.userRepo.findUserByIdWithDetails(id);

        return UserDTO.fromDatabase(user);
    }
}

module.exports = FindUserUseCase;