const Joi = require('joi');
const { createCompanySchema } = require('./company.schema');
const { createUserSchema } = require('./user.schema');

const email = Joi.string().email();
const password = Joi.string();

const signInSchema = Joi.object({
	email: email.required(),
	password: password.required(),
});

const signUpSchema = Joi.object({
	company: createCompanySchema, // Reutiliza el schema de Company
	user: createUserSchema.keys({
		// Ajustes específicos para el registro:
		rfc: Joi.forbidden(), // No se envía el RFC del usuario (se toma de la empresa)
		role: Joi.string().required(), // El rol es obligatorio
	}),
});

module.exports = { signInSchema, signUpSchema };
