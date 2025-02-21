const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth.service');

const router = express.Router();
const service = new AuthService();

router.post(
	'/sign-in',
	passport.authenticate('local', { session: false }),
	async (req, res, next) => {
		try {
			const user = req.user;
			const token = service.signToken(user);
			res.status(200).json({ token });
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
