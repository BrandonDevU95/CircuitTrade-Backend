
const { createContainer, asClass, asValue } = require("awilix");

const sequelize = require("@infrastructure/db");
//Repositories
const UserRepository = require("@domain/repositories/user.repository");
const CompanyRepository = require("@domain/repositories/company.repository");
const RoleRepository = require("@domain/repositories/role.repository");
const RefreshTokenRepository = require("@domain/repositories/refreshToken.repository");
//UserUseCases
const CreateUserUseCase = require("@application/usecases/user/create-user.usecase");
const DeleteUserUseCase = require("@application/usecases/user/delete-user.usecase");
const FindUserUseCase = require("@application/usecases/user/find-user.usecase");
const FindUsersUseCase = require("@application/usecases/user/find-users.usecase");
const UpdateUserUseCase = require("@application/usecases/user/update-user.usecase");
//CompanyUseCases
const CreateCompanyUseCase = require("@application/usecases/company/create-company.usecase");
const DeleteCompanyUseCase = require("@application/usecases/company/delete-company.usecase");
const FindCompanyUseCase = require("@application/usecases/company/find-company.usecase");
const FindCompaniesUseCase = require("@application/usecases/company/find-companies.usecase");
const UpdateCompanyUseCase = require("@application/usecases/company/update-company.usecase");
//RoleUseCases
const CreateRoleUseCase = require("@application/usecases/role/create-role.usecase");
const DeleteRoleUseCase = require("@application/usecases/role/delete-role.usecase");
const FindRoleUseCase = require("@application/usecases/role/find-role.usecase");
const FindRolesUseCase = require("@application/usecases/role/find-roles.usecase");
const UpdateRoleUseCase = require("@application/usecases/role/update-role.usecase");
//RefreshTokenUseCases
const UpsertTokenUseCase = require("@application/usecases/refresh-token/upsert-token.usecase");
const RevokeToken = require("@application/usecases/refresh-token/revoke-token.usecase");
const GetTokenUseCase = require("@application/usecases/refresh-token/get-token.usecase");
//AuthUseCases
const SignInUseCase = require("@application/usecases/auth/sign-in.usecase");
const SignUpUseCase = require("@application/usecases/auth/sign-up.usecase");
const UserInfoUseCase = require("@application/usecases/auth/user-info.usecase");
//Services
const TokenService = require("@infrastructure/services/token.service");
//Controllers
const UserController = require("@interfaces/controllers/user.controller");
const CompanyController = require("@interfaces/controllers/company.controller");
const RoleController = require("@interfaces/controllers/role.controller");
const AuthController = require("@interfaces/controllers/auth.controller");
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
container.register({
    signInUseCase: asClass(SignInUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
        tokenService: container.resolve("tokenService"),
        upsertTokenUseCase: container.resolve("upsertTokenUseCase"),
    })),
    signUpUseCase: asClass(SignUpUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
        companyRepo: container.resolve("companyRepo"),
        roleRepo: container.resolve("roleRepo"),
        tokenService: container.resolve("tokenService"),
        upsertTokenUseCase: container.resolve("upsertTokenUseCase"),
    })),
    userInfoUseCase: asClass(UserInfoUseCase).inject(() => ({
        userRepo: container.resolve("userRepo"),
    })),
});
//Despues inyecta los repositorios en los servicios que son los que recibe el constructor
container.register({
    tokenService: asClass(TokenService),
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
        signUpUseCase: container.resolve("signUpUseCase"),
        userInfoUseCase: container.resolve("userInfoUseCase"),
    })),

});

module.exports = container;