const express = require('express');
const container = require('@config/container');
const validatorHandler = require('@middlewares/validator.handler');
const { createUserSchema, updateUserSchema, getUserSchema } = require('@schemas/user.schema');
const router = express.Router();

const controller = container.resolve("userController");

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
