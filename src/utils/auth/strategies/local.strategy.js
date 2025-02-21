const { Strategy } = require('passport-local');

const AuthService = require('../../../services/auth.service');
const service = new AuthService();

const LocalStrategy = new Strategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async (email, password, done) => {
		try {
			const user = await service.getUser(email, password);
			if (!user) {
				return done(null, false, { message: 'Invalid credentials' });
			}
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	}
);

module.exports = LocalStrategy;
