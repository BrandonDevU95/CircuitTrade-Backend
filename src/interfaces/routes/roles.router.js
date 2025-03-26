const express = require('express');
const container = require('@infrastructure/config/container');
const validatorHandler = require('@interfaces/middlewares/validator.handler');
const {
	createRoleSchema,
	updateRoleSchema,
	getRoleSchema,
} = require('@interfaces/schemas/role.schema');
const router = express.Router();

const controller = container.resolve('roleController');

router.get('/', controller.getRoles.bind(controller));
router.get('/:id', validatorHandler(getRoleSchema, 'params'), controller.getRole.bind(controller));
router.post('/', validatorHandler(createRoleSchema, 'body'), controller.createRole.bind(controller));
router.patch('/:id', validatorHandler(getRoleSchema, 'params'), validatorHandler(updateRoleSchema, 'body'), controller.updateRole.bind(controller));
router.delete('/:id', validatorHandler(getRoleSchema, 'params'), controller.deleteRole.bind(controller));

module.exports = router;
