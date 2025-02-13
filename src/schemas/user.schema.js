const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100).trim();
const password = Joi.string().min(6).max(255);
const email = Joi.string().email().lowercase().trim();
const phone = Joi.string()
	.min(9)
	.max(15)
	.pattern(/^\+?[0-9]{7,15}$/);
const rfc = Joi.string().min(12).max(13);

const createUserSchema = Joi.object({
	name: name.required(),
	password: password.required(),
	email: email.required(),
	phone: phone,
	rfc: rfc.required(),
});

const updateUserSchema = Joi.object({
	name: name,
	password: password,
	email: email,
	phone: phone,
});

const getUserSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createUserSchema,
	updateUserSchema,
	getUserSchema,
};
