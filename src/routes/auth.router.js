const express = require('express');
const passport = require('passport');
const JWTManager = require('../utils/jwt.utils');
const validatorHandler = require('../middlewares/validator.handler');
const { signInSchema, signUpSchema } = require('../schemas/auth.schema');
const RefreshTokenService = require('../services/refreshToken.service');
const AuthService = require('../services/auth.service');
const boom = require('@hapi/boom');
const sequelize = require('../db');
const { config } = require('../config/config');

const refreshTokenService = new RefreshTokenService();
const authService = new AuthService();
const router = express.Router();

router.post(
	'/sign-in',
	validatorHandler(signInSchema, 'body'),
	passport.authenticate('local', { session: false }),
	async (req, res, next) => {
		const transaction = await sequelize.transaction();
		try {
			const user = req.user;

			const accessToken = JWTManager.generateAccessToken(user);
			const refreshToken = JWTManager.generateRefreshToken(user);

			if (!accessToken || !refreshToken) {
				throw boom.badImplementation('Error generating tokens');
			}

			await refreshTokenService.upsertRefreshToken(user.id, refreshToken, transaction);

			res.cookie('access_token', accessToken, {
				httpOnly: true,
				secure: config.env === 'production',
				sameSite: 'Strict',
				maxAge: 1000 * 60 * 15, // 15 minutes
			});

			await transaction.commit();
			res.status(200).json({ user });
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	}
);

router.post('/sign-up', validatorHandler(signUpSchema, 'body'), async (req, res, next) => {
	try {
		const { company, user } = req.body;
		const userData = await authService.signUp(company, user);

		if (!userData || !userData?.user || !userData?.accessToken) {
			throw boom.badImplementation('Error creating user');
		}

		res.cookie('access_token', userData.accessToken, {
			httpOnly: true,
			secure: config.env === 'production',
			sameSite: 'Strict',
			maxAge: 1000 * 60 * 15, // 15 minutes
		});

		res.status(201).json({ user: userData.user });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
