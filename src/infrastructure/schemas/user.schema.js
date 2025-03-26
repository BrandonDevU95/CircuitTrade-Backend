const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100).trim();
const password = Joi.string().min(6).max(30);
const currentPassword = Joi.string().min(6).max(30);
const newPassword = Joi.string().min(6).max(30);
const email = Joi.string().email().lowercase().trim();
const phone = Joi.string()
	.min(9)
	.max(15)
	.pattern(/^\+?[0-9]{7,15}$/);
const rfc = Joi.string().min(12).max(13);
const role = Joi.string().min(3).max(30).trim();
const isActive = Joi.boolean();

const createUserSchema = Joi.object({
	name: name.required(),
	password: password.required(),
	email: email.required(),
	phone: phone,
	rfc: rfc.required(),
	role: role.required(),
	isActive: isActive.required(),
});

const updateUserSchema = Joi.object({
	name: name,
	email: email,
	phone: phone,
	role: role,
	isActive: isActive,
	currentPassword: currentPassword,
	newPassword: newPassword,
}).and('currentPassword', 'newPassword')

const getUserSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createUserSchema,
	updateUserSchema,
	getUserSchema,
};
