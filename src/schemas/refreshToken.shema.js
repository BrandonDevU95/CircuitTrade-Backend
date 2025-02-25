const Joi = require('joi');

const token = Joi.string().min(64).max(512);
const expiresAt = Joi.date().iso();
const userId = Joi.number().integer().positive();

const createRefreshTokenSchema = Joi.object({
	token: token.required(),
	expiresAt: expiresAt.required(),
	userId: userId.required(),
});

const updateRefreshTokenSchema = Joi.object({
	token: token,
	expiresAt: expiresAt,
});

module.exports = {
	createRefreshTokenSchema,
	updateRefreshTokenSchema,
};
