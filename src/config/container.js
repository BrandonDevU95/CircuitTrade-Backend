
const { createContainer, asClass, asValue } = require("awilix");

const sequelize = require("@db");
//Repositories
const UserRepository = require("@repositories/user.repository");
const CompanyRepository = require("@repositories/company.repository");
const RoleRepository = require("@repositories/role.repository");
//Services
const UserService = require("@services/user.service");
const CompanyService = require("@services/company.service");
//Controllers
const UserController = require("@controllers/user.controller");
const CompanyController = require("@controllers/company.controller");

const container = createContainer();

//Primero registra los modelos de la base de datos
container.register({
    userModel: asValue(sequelize.models.User),
    companyModel: asValue(sequelize.models.Company),
    roleModel: asValue(sequelize.models.Role),
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
});

//Por ultimo inyecta los repositorios en los servicios y los servicios en los controladores
container.register({
    userService: asClass(UserService).inject(() => ({
        userRepo: container.resolve("userRepo"),
        companyRepo: container.resolve("companyRepo"),
        roleRepo: container.resolve("roleRepo"),
    })),
    companyService: asClass(CompanyService).inject(() => ({
        companyRepo: container.resolve("companyRepo"),
        userRepo: container.resolve("userRepo"),
    })),
    userController: asClass(UserController).inject(() => ({
        userService: container.resolve("userService"),
    })),
    companyController: asClass(CompanyController).inject(() => ({
        companyService: container.resolve("companyService"),
    })),
});

module.exports = container;