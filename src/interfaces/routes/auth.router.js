const express = require('express');
const passport = require('passport');
const container = require('@infrastructure/config/container');
const validatorHandler = require('@interfaces/middlewares/validator.handler');
const { signInSchema, signUpSchema } = require('@interfaces/schemas/auth.schema');
const { accessTokenHandler, refreshTokenHandler } = require('@interfaces/middlewares/tokens.handler');
const router = express.Router();

const controller = container.resolve('authController');

router.post(
	'/sign-in',
	validatorHandler(signInSchema, 'body'),
	passport.authenticate('local', { session: false }),
	controller.signIn.bind(controller)
);
router.post('/sign-up', validatorHandler(signUpSchema, 'body'), controller.signUp.bind(controller));

router.get(
	'/me',
	accessTokenHandler,
	passport.authenticate('jwt', { session: false }),
	controller.me.bind(controller)
);

router.post(
	'/refresh',
	refreshTokenHandler,
	controller.refresh.bind(controller)
);

module.exports = router;
