const express = require('express');
const passport = require('passport');
const JWTManager = require('../utils/jwt');
const validatorHandler = require('../middlewares/validator.handler');
const { signInSchema } = require('../schemas/auth.schema');

const router = express.Router();

router.post(
	'/sign-in',
	validatorHandler(signInSchema, 'body'),
	passport.authenticate('local', { session: false }),
	async (req, res, next) => {
		try {
			const user = req.user;
			const { accessToken, refreshToken } =
				JWTManager.generateTokens(user);
			res.status(200).json({ user, accessToken, refreshToken });
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
