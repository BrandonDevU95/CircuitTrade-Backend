
const { createContainer, asClass, asValue } = require("awilix");

const sequelize = require("@db");
//Repositories
const UserRepository = require("@repositories/user.repository");
const CompanyRepository = require("@repositories/company.repository");
const RoleRepository = require("@repositories/role.repository");
const RefreshTokenRepository = require("@repositories/refreshToken.repository");
//UseCases
const CreateUserUseCase = require("@usecases/user/create-user.usecase");
const DeleteUserUseCase = require("@usecases/user/delete-user.usecase");
const FindUserUseCase = require("@usecases/user/find-user.usecase");
const FindUsersUseCase = require("@usecases/user/find-users.usecase");
const UpdateUserUseCase = require("@usecases/user/update-user.usecase");
//Services
const CompanyService = require("@services/company.service");
const RoleService = require("@services/role.service");
const RefreshTokenService = require("@services/refreshToken.service");
const TokenService = require("@services/token.service");
const AuthService = require("@services/auth.service");
//Controllers
const UserController = require("@controllers/user.controller");
const CompanyController = require("@controllers/company.controller");
const RoleController = require("@controllers/role.controller");
const AuthController = require("@controllers/auth.controller");
const container = createContainer();

//Primero registra los modelos de la base de datos
container.register({
    userModel: asValue(sequelize.models.User),
    companyModel: asValue(sequelize.models.Company),
    roleModel: asValue(sequelize.models.Role),
    refreshTokenModel: asValue(sequelize.models.RefreshToken)
});

//Despues inyecta los modelos en los repositorios que son los que recibe el constructor
container.register({
    userRepo: asClass(UserRepository).inject(() => ({
        model: container.resolve("userModel"),
    })),
    companyRepo: asClass(CompanyRepository).inject(() => ({
        model: container.resolve("companyModel"),
    })),
    roleRepo: asClass(RoleRepository).inject(() => ({
        model: container.resolve("roleModel"),
    })),
    refreshTokenRepo: asClass(RefreshTokenRepository).inject(() => ({
        model: container.resolve("refreshTokenModel")
    }))
});

//Despues inyecta los repositorios en los casos de uso que son los que recibe el constructor
container.register({
    createUserUseCase: asClass(CreateUserUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
        companyRepo: container.resolve("companyRepo"),
        roleRepo: container.resolve("roleRepo"),
    })),
    deleteUserUseCase: asClass(DeleteUserUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
    })),
    findUserUseCase: asClass(FindUserUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
    })),
    findUsersUseCase: asClass(FindUsersUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
    })),
    updateUserUseCase: asClass(UpdateUserUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
        roleRepo: container.resolve("roleRepo"),
    })),
});

//Despues inyecta los repositorios en los servicios que son los que recibe el constructor
container.register({
    companyService: asClass(CompanyService).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
        userRepo: container.resolve("userRepo"),
    })),
    roleService: asClass(RoleService).inject(() => ({
        roleRepo: container.resolve("roleRepo"),
    })),
    tokenService: asClass(TokenService),
    refreshTokenService: asClass(RefreshTokenService).inject(() => ({
        refreshTokenRepo: container.resolve("refreshTokenRepo")
    })),
    authService: asClass(AuthService).inject(() => ({
        userRepo: container.resolve("userRepo"),
        companyRepo: container.resolve("companyRepo"),
        roleRepo: container.resolve("roleRepo"),
        tokenService: container.resolve("tokenService"),
        refreshTokenService: container.resolve("refreshTokenService")
    })),
});

//Por ultimo inyecta los servicios en los controladores que son los que recibe el constructor
container.register({
    userController: asClass(UserController).inject(() => ({
        createUserUseCase: container.resolve("createUserUseCase"),
        deleteUserUseCase: container.resolve("deleteUserUseCase"),
        findUserUseCase: container.resolve("findUserUseCase"),
        findUsersUseCase: container.resolve("findUsersUseCase"),
        updateUserUseCase: container.resolve("updateUserUseCase"),
    })),
    companyController: asClass(CompanyController).inject(() => ({
        companyService: container.resolve("companyService"),
    })),
    roleController: asClass(RoleController).inject(() => ({
        roleService: container.resolve("roleService"),
    })),
    authController: asClass(AuthController).inject(() => ({
        authService: container.resolve("authService"),
    })),

});

module.exports = container;