const express = require('express');
const userService = require('@services/user.service');
const validatorHandler = require('@middlewares/validator.handler');

const { createUserSchema, updateUserSchema, getUserSchema } = require('@schemas/user.schema');

const router = express.Router();
const service = new userService();

router.get('/', async (req, res) => {
	const users = await service.find();
	res.json(users);
});

router.get('/:id', validatorHandler(getUserSchema, 'params'), async (req, res) => {
	const { id } = req.params;
	const user = await service.findOne(id);
	res.json(user);
});

router.post('/', validatorHandler(createUserSchema, 'body'), async (req, res, next) => {
	const body = req.body;
	const newUser = await service.create(body);
	res.status(201).json(newUser);
});

router.patch(
	'/:id',
	validatorHandler(getUserSchema, 'params'),
	validatorHandler(updateUserSchema, 'body'),
	async (req, res) => {
		const { id } = req.params;
		const body = req.body;
		const updatedUser = await service.update(id, body);
		res.json(updatedUser);
	}
);

router.delete('/:id', validatorHandler(getUserSchema, 'params'), async (req, res) => {
	const { id } = req.params;
	const deletedUser = await service.delete(id);
	res.json(deletedUser);
});

module.exports = router;
