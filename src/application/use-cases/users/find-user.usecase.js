class FindUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        return await this.userRepository.findById(id);
    }
}

module.exports = { FindUserUseCase };
