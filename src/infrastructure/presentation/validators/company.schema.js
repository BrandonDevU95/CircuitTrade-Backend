const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100);
const rfc = Joi.string()
	.max(13)
	.pattern(/^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][0-9A-Z]([0-9A])?$/i)
	.message('Invalid RFC');
const address = Joi.string().min(3).max(255);
const phone = Joi.string()
	.min(10)
	.max(20)
	.pattern(/^[+0-9]\d{9,14}$/);
const email = Joi.string().email();
const type = Joi.string().valid('supplier', 'buyer', 'hybrid');

const createCompanySchema = Joi.object({
	name: name.required().trim(),
	rfc: rfc.required().trim(),
	address: address.required().trim(),
	phone: phone.required().trim(),
	email: email.required().trim(),
	type: type.required().trim(),
});

const updateCompanySchema = Joi.object({
	name: name.trim(),
	rfc: rfc.trim(),
	address: address.trim(),
	phone: phone.trim(),
	email: email.trim(),
	type: type.trim(),
});

const getCompanySchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createCompanySchema,
	updateCompanySchema,
	getCompanySchema,
};
