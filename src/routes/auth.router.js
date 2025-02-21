const express = require('express');
const passport = require('passport');
const JWTManager = require('../utils/jwt');

const router = express.Router();

router.post(
	'/sign-in',
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
