const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../../db/models/user.model');
const boom = require('@hapi/boom');

const { config } = require('../../config/config');

const options = {
	secretOrKey: config.jwtSecret,
	jwtFromRequest: ExtractJwt.fromExtractors([
		(req) => req.cookies.access_token,
	]),
	passReqToCallback: true, // Agregado para que se pase req al callback
};

const JWTStrategy = new Strategy(options, async (req, payload, done) => {
	try {
		if (!req.user || payload.sub !== req.user.sub) {
			return done(boom.unauthorized(), false);
		}

		const user = await User.findByPk(payload.sub, {
			attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
		});

		if (!user || !user.isActive) {
			return done(boom.unauthorized(), false);
		}

		return done(null, { ...user.dataValues });
	} catch (error) {
		return done(error, false);
	}
});

module.exports = JWTStrategy;
