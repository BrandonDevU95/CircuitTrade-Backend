const { Strategy } = require('passport-local');
const container = require('@infraestructure/config/container');

const signInUseCase = container.resolve('signInUseCase');

const LocalStrategy = new Strategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async (email, password, done) => {
		try {
			const user = await signInUseCase.execute(email, password);
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	}
);

module.exports = LocalStrategy;
