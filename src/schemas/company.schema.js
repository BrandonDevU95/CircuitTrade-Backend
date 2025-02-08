const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100);
const rfc = Joi.string().max(13);
const address = Joi.string().min(3).max(255);
const phone = Joi.string().min(10).max(20);
const email = Joi.string().email();
const type = Joi.string().valid('supplier', 'buyer', 'hybrid');

const createCompanySchema = Joi.object({
	name: name.required(),
	rfc: rfc.required(),
	address: address.required(),
	phone: phone.required(),
	email: email.required(),
	type: type.required(),
});

const updateCompanySchema = Joi.object({
	name: name,
	rfc: rfc,
	address: address,
	phone: phone,
	email: email,
	type: type,
});

const getCompanySchema = Joi.object({
	id: id.required(),
});

module.exports = { createCompanySchema, updateCompanySchema, getCompanySchema };
