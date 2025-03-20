const { Strategy } = require('passport-local');
const container = require('@config/container');

const authService = container.resolve('authService');

const LocalStrategy = new Strategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async (email, password, done) => {
		try {
			const user = await authService.authenticate(email, password);
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	}
);

module.exports = LocalStrategy;
