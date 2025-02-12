const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100);
const password = Joi.string().min(6).max(100);
const email = Joi.string().email();
const phone = Joi.string().min(10).max(15);
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
	rfc: rfc,
});

const getUserSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createUserSchema,
	updateUserSchema,
	getUserSchema,
};
