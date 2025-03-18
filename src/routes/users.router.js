const express = require('express');
const sequelize = require('@db');
const UserService = require('@services/user.service');
const UserController = require('@controllers/user.controller');
const validatorHandler = require('@middlewares/validator.handler');
const UserRepository = require('@repositories/user.repository');
const CompanyRepository = require('@repositories/company.repository');
const RoleRepository = require('@repositories/role.repository');

const { createUserSchema, updateUserSchema, getUserSchema } = require('@schemas/user.schema');

const userRepo = new UserRepository(sequelize.models.User);
const companyRepo = new CompanyRepository(sequelize.models.Company);
const roleRepo = new RoleRepository(sequelize.models.Role);

const router = express.Router();
const service = new UserService(userRepo, companyRepo, roleRepo);
const controller = new UserController(service);

router.get('/', controller.getUsers.bind(controller));
router.get('/:id', validatorHandler(getUserSchema, 'params'), controller.getUser.bind(controller));
router.post('/', validatorHandler(createUserSchema, 'body'), controller.createUser.bind(controller));
router.patch(
	'/:id',
	validatorHandler(getUserSchema, 'params'),
	validatorHandler(updateUserSchema, 'body'),
	controller.updateUser.bind(controller)
);
router.delete('/:id', validatorHandler(getUserSchema, 'params'), controller.deleteUser.bind(controller));

module.exports = router;
