class UserController {
    constructor({
        createUserUseCase,
        deleteUserUseCase,
        findUserUseCase,
        findUsersUseCase,
        updateUserUseCase
    }) {
        this.createUserUseCase = createUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.findUserUseCase = findUserUseCase;
        this.findUsersUseCase = findUsersUseCase;
        this.updateUserUseCase = updateUserUseCase;
    }

    async getUsers(req, res) {
        const users = await this.findUsersUseCase.execute();
        res.json(users);
    }

    async getUser(req, res) {
        const { id } = req.params;
        const user = await this.findUserUseCase.execute(id);
        res.json(user);
    }

    async createUser(req, res) {
        const body = req.body;
        const newUser = await this.createUserUseCase.execute(body);
        res.status(201).json(newUser);
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const body = req.body;
        const updatedUser = await this.updateUserUseCase.execute(id, body);
        res.json(updatedUser);
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        const deletedUser = await this.deleteUserUseCase.execute(id);
        res.json(deletedUser);
    }

}

module.exports = UserController;