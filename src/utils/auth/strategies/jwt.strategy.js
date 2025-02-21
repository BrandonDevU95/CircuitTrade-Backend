const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../../../db/models/user.model');
const boom = require('@hapi/boom');

const { config } = require('../../../config/config');

const options = {
	secretOrKey: config.jwtSecret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const JWTStrategy = new Strategy(options, async (tokenPayload, done) => {
	try {
		const user = await User.findByPk(tokenPayload.sub, {
			attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
		});

		if (!user || !user.isActive) {
			return done(boom.unauthorized(), false);
		}

		return done(null, { ...user.dataValues });
	} catch (error) {
		return done(boom.internal('JWT verification error', error));
	}
});

module.exports = JWTStrategy;
