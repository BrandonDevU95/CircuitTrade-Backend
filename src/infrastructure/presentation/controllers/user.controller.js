const boom = require('@hapi/boom');

class UserController {
    constructor({ createUserUseCase, updateUserUseCase, deleteUserUseCase, findUserUseCase, findAllUsersUseCase }) {
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.findUserUseCase = findUserUseCase;
        this.findAllUsersUseCase = findAllUsersUseCase;
    }

    async createUser(req, res, next) {
        try {
            const userData = req.body;
            const createdUser = await this.createUserUseCase.execute(userData);
            res.status(201).json(createdUser);
        } catch (error) {
            if (error.message === 'USER_ALREADY_EXISTS') {
                next(boom.badRequest('User already exists'));
            } else {
                next(error);
            }
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await this.updateUserUseCase.execute(id, updateData);
            res.json(updatedUser);
        } catch (error) {
            if (error.message === 'USER_NOT_FOUND') {
                next(boom.notFound('User not found'));
            } else {
                next(error);
            }
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.deleteUserUseCase.execute(id);
            res.json(result);
        } catch (error) {
            if (error.message === 'USER_NOT_FOUND' || error.message === 'USER_DELETE_FAILED') {
                next(boom.notFound('User not found or delete failed'));
            } else {
                next(error);
            }
        }
    }

    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await this.findUserUseCase.execute(id);
            res.json(user);
        } catch (error) {
            if (error.message === 'USER_NOT_FOUND') {
                next(boom.notFound('User not found'));
            } else {
                next(error);
            }
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await this.findAllUsersUseCase.execute();
            res.json(users);
        } catch (error) {
            if (error.message === 'NO_USERS_FOUND') {
                next(boom.notFound('No users found'));
            } else {
                next(error);
            }
        }
    }
}

module.exports = { UserController };
