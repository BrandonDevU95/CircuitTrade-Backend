class UpdateUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(id, updateData) {
        return await this.userRepository.update(id, updateData);
    }
}

module.exports = { UpdateUserUseCase };
