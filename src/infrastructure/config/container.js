const { createContainer, asClass } = require('awilix');

// Repositorios e inyección de dependencias
const { UserSequelizeRepository } = require('../repositories/user.sequelize-repository');
// Casos de uso
const { CreateUserUseCase } = require('../../application/use-cases/users/create-user.usecase');
const { UpdateUserUseCase } = require('../../application/use-cases/users/update-user.usecase');
const { DeleteUserUseCase } = require('../../application/use-cases/users/delete-user.usecase');
const { FindUserUseCase } = require('../../application/use-cases/users/find-user.usecase');
const { FindAllUsersUseCase } = require('../../application/use-cases/users/find-all-users.usecase');
// Controlador
const { UserController } = require('../presentation/controllers/user.controller');
// Importar instancia de Sequelize
const sequelize = require('../../infrastructure/db/sequelize.config');

const container = createContainer();

container.register({
    // Registrar el repositorio inyectando los modelos de Sequelize
    userRepository: asClass(UserSequelizeRepository)
        .singleton()
        .inject(() => ({ models: sequelize.models })),
    // Registrar los casos de uso
    createUserUseCase: asClass(CreateUserUseCase).singleton(),
    updateUserUseCase: asClass(UpdateUserUseCase).singleton(),
    deleteUserUseCase: asClass(DeleteUserUseCase).singleton(),
    findUserUseCase: asClass(FindUserUseCase).singleton(),
    findAllUsersUseCase: asClass(FindAllUsersUseCase).singleton(),
    // Registrar el controlador e inyectar los casos de uso
    userController: asClass(UserController)
        .singleton()
        .inject(() => ({
            createUserUseCase: container.resolve('createUserUseCase'),
            updateUserUseCase: container.resolve('updateUserUseCase'),
            deleteUserUseCase: container.resolve('deleteUserUseCase'),
            findUserUseCase: container.resolve('findUserUseCase'),
            findAllUsersUseCase: container.resolve('findAllUsersUseCase'),
        })),
});

module.exports = container;
