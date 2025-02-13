const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string()
	.min(3)
	.max(50)
	.pattern(/^[a-zA-Z ]+$/)
	.trim();
const description = Joi.string().min(3).max(255).trim();

const createRoleSchema = Joi.object({
	name: name.required(),
	description: description.required(),
});

const updateRoleSchema = Joi.object({
	name: name,
	description: description,
});

const getRoleSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createRoleSchema,
	updateRoleSchema,
	getRoleSchema,
};
