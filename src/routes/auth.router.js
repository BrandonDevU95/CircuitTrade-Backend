const express = require('express');
const passport = require('passport');

const AuthService = require('@services/auth.service');
const TokenService = require('@services/token.service');
const AuthController = require('@controllers/auth.controller');
const validatorHandler = require('@middlewares/validator.handler');
const RefreshTokenService = require('@services/refreshToken.service');
const { signInSchema, signUpSchema } = require('@schemas/auth.schema');

const router = express.Router();

const authService = new AuthService();
const tokenService = new TokenService();
const refreshTokenService = new RefreshTokenService();
const controller = new AuthController(authService, refreshTokenService, tokenService);

router.post(
	'/sign-in',
	validatorHandler(signInSchema, 'body'),
	passport.authenticate('local', { session: false }),
	controller.signIn.bind(controller)
);
router.post('/sign-up', validatorHandler(signUpSchema, 'body'), controller.signUp.bind(controller));

module.exports = router;
