const express = require('express');

const RoleService = require('@services/role.service');
const validatorHandler = require('@middlewares/validator.handler');
const RoleController = require('@controllers/role.controller');
const {
	createRoleSchema,
	updateRoleSchema,
	getRoleSchema,
} = require('@schemas/role.schema');

const router = express.Router();
const service = new RoleService();
const controller = new RoleController(service);

router.get('/', controller.getRoles.bind(controller));
router.get('/:id', validatorHandler(getRoleSchema, 'params'), controller.getRole.bind(controller));
router.post('/', validatorHandler(createRoleSchema, 'body'), controller.createRole.bind(controller));
router.patch('/:id', validatorHandler(getRoleSchema, 'params'), validatorHandler(updateRoleSchema, 'body'), controller.updateRole.bind(controller));
router.delete('/:id', validatorHandler(getRoleSchema, 'params'), controller.deleteRole.bind(controller));

module.exports = router;
