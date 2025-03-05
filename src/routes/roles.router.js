const express = require('express');

const roleService = require('@services/role.service');
const validatorHandler = require('@middlewares/validator.handler');

const {
	createRoleSchema,
	updateRoleSchema,
	getRoleSchema,
} = require('@schemas/role.schema');

const router = express.Router();
const service = new roleService();

router.get('/', async (req, res) => {
	const roles = await service.find();
	res.json(roles);
});

router.get(
	'/:id',
	validatorHandler(getRoleSchema, 'params'),
	async (req, res) => {
		const { id } = req.params;
		const role = await service.findOne(id);
		res.json(role);
	}
);

router.post(
	'/',
	validatorHandler(createRoleSchema, 'body'),
	async (req, res) => {
		const body = req.body;
		const newRole = await service.create(body);
		res.status(201).json(newRole);
	}
);

router.patch(
	'/:id',
	validatorHandler(getRoleSchema, 'params'),
	validatorHandler(updateRoleSchema, 'body'),
	async (req, res) => {
		const { id } = req.params;
		const body = req.body;
		const updatedRole = await service.update(id, body);
		res.json(updatedRole);
	}
);

router.delete(
	'/:id',
	validatorHandler(getRoleSchema, 'params'),
	async (req, res) => {
		const { id } = req.params;
		await service.delete(id);
		res.status(204).end();
	}
);

module.exports = router;
