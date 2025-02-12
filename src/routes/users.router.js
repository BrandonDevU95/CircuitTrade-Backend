const express = require('express');

const userService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validator.handler');

const {
	createUserSchema,
	updateUserSchema,
	getUserSchema,
} = require('./../schemas/user.schema');

const router = express.Router();
const service = new userService();

router.get('/', async (req, res, next) => {
	try {
		const users = await service.find();
		res.json(users);
	} catch (error) {
		next(error);
	}
});

router.get(
	'/:id',
	validatorHandler(getUserSchema, 'params'),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const user = await service.findOne(id);
			res.json(user);
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/',
	validatorHandler(createUserSchema, 'body'),
	async (req, res, next) => {
		try {
			const body = req.body;
			const newUser = await service.create(body);
			res.status(201).json(newUser);
		} catch (error) {
			next(error);
		}
	}
);

router.patch(
	'/:id',
	validatorHandler(getUserSchema, 'params'),
	validatorHandler(updateUserSchema, 'body'),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const body = req.body;
			const updatedUser = await service.update(id, body);
			res.json(updatedUser);
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/:id',
	validatorHandler(getUserSchema, 'params'),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const deletedUser = await service.delete(id);
			res.json(deletedUser);
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
