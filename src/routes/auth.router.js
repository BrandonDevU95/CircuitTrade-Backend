const express = require('express');
const passport = require('passport');
const JWTManager = require('../utils/jwt');
const validatorHandler = require('../middlewares/validator.handler');
const { signInSchema } = require('../schemas/auth.schema');
const RefreshTokenService = require('../services/refreshToken.service');
const boom = require('@hapi/boom');
const { config } = require('../config/config');

const service = new RefreshTokenService();
const router = express.Router();

router.post(
	'/sign-in',
	validatorHandler(signInSchema, 'body'),
	passport.authenticate('local', { session: false }),
	async (req, res, next) => {
		try {
			const user = req.user;
			const accessToken = JWTManager.generateAccessToken(user);
			const refreshToken = JWTManager.generateRefreshToken(user);

			const refreshTokenDB = await service.upsertRefreshToken(
				user.id,
				refreshToken
			);

			if (!refreshTokenDB) {
				throw boom.badImplementation('Error creating refresh token');
			}

			res.cookie('access_token', accessToken, {
				httpOnly: true,
				secure: config.env === 'production',
				sameSite: 'Strict',
				maxAge: 1000 * 60 * 15, // 15 minutes
			});

			res.json({ user });
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
