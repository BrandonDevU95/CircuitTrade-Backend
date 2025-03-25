
const { createContainer, asClass, asValue } = require("awilix");

const sequelize = require("@db");
//Repositories
const UserRepository = require("@repositories/user.repository");
const CompanyRepository = require("@repositories/company.repository");
const RoleRepository = require("@repositories/role.repository");
const RefreshTokenRepository = require("@repositories/refreshToken.repository");
//UserUseCases
const CreateUserUseCase = require("@usecases/user/create-user.usecase");
const DeleteUserUseCase = require("@usecases/user/delete-user.usecase");
const FindUserUseCase = require("@usecases/user/find-user.usecase");
const FindUsersUseCase = require("@usecases/user/find-users.usecase");
const UpdateUserUseCase = require("@usecases/user/update-user.usecase");
//CompanyUseCases
const CreateCompanyUseCase = require("@usecases/company/create-company.usecase");
const DeleteCompanyUseCase = require("@usecases/company/delete-company.usecase");
const FindCompanyUseCase = require("@usecases/company/find-company.usecase");
const FindCompaniesUseCase = require("@usecases/company/find-companies.usecase");
const UpdateCompanyUseCase = require("@usecases/company/update-company.usecase");
//RoleUseCases
const CreateRoleUseCase = require("@usecases/role/create-role.usecase");
const DeleteRoleUseCase = require("@usecases/role/delete-role.usecase");
const FindRoleUseCase = require("@usecases/role/find-role.usecase");
const FindRolesUseCase = require("@usecases/role/find-roles.usecase");
const UpdateRoleUseCase = require("@usecases/role/update-role.usecase");
//RefreshTokenUseCases
const UpsertTokenUseCase = require("@usecases/refresh-token/upsert-token.usecase");
const RevokeToken = require("@usecases/refresh-token/revoke-token.usecase");
const GetTokenUseCase = require("@usecases/refresh-token/get-token.usecase");
//Services
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
container.register({
    createCompanyUseCase: asClass(CreateCompanyUseCase).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
    })),
    deleteCompanyUseCase: asClass(DeleteCompanyUseCase).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
        userRepo: container.resolve("userRepo"),
    })),
    findCompanyUseCase: asClass(FindCompanyUseCase).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
    })),
    findCompaniesUseCase: asClass(FindCompaniesUseCase).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
    })),
    updateCompanyUseCase: asClass(UpdateCompanyUseCase).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
    })),
});
container.register({
    createRoleUseCase: asClass(CreateRoleUseCase).inject(() => ({
        roleRepo: container.resolve("roleRepo"),
    })),
    deleteRoleUseCase: asClass(DeleteRoleUseCase).inject(() => ({
        roleRepo: container.resolve("roleRepo"),
    })),
    findRoleUseCase: asClass(FindRoleUseCase).inject(() => ({
        roleRepo: container.resolve("roleRepo"),
    })),
    findRolesUseCase: asClass(FindRolesUseCase).inject(() => ({
        roleRepo: container.resolve("roleRepo"),
    })),
    updateRoleUseCase: asClass(UpdateRoleUseCase).inject(() => ({
        roleRepo: container.resolve("roleRepo"),
    })),
});
container.register({
    upsertTokenUseCase: asClass(UpsertTokenUseCase).inject(() => ({
        refreshTokenRepo: container.resolve("refreshTokenRepo"),
    })),
    revokeTokenUseCase: asClass(RevokeToken).inject(() => ({
        refreshTokenRepo: container.resolve("refreshTokenRepo"),
    })),
    getTokenUseCase: asClass(GetTokenUseCase).inject(() => ({
        refreshTokenRepo: container.resolve("refreshTokenRepo"),
    })),
});
//Despues inyecta los repositorios en los servicios que son los que recibe el constructor
container.register({
    tokenService: asClass(TokenService),
    authService: asClass(AuthService).inject(() => ({
        userRepo: container.resolve("userRepo"),
        companyRepo: container.resolve("companyRepo"),
        roleRepo: container.resolve("roleRepo"),
        tokenService: container.resolve("tokenService"),
        upsertTokenUseCase: container.resolve("upsertTokenUseCase"),
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
        createCompanyUseCase: container.resolve("createCompanyUseCase"),
        deleteCompanyUseCase: container.resolve("deleteCompanyUseCase"),
        findCompanyUseCase: container.resolve("findCompanyUseCase"),
        findCompaniesUseCase: container.resolve("findCompaniesUseCase"),
        updateCompanyUseCase: container.resolve("updateCompanyUseCase"),
    })),
    roleController: asClass(RoleController).inject(() => ({
        createRoleUseCase: container.resolve("createRoleUseCase"),
        deleteRoleUseCase: container.resolve("deleteRoleUseCase"),
        findRoleUseCase: container.resolve("findRoleUseCase"),
        findRolesUseCase: container.resolve("findRolesUseCase"),
        updateRoleUseCase: container.resolve("updateRoleUseCase"),
    })),
    authController: asClass(AuthController).inject(() => ({
        authService: container.resolve("authService"),
    })),

});

module.exports = container;