const boom = require('@hapi/boom');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('@infraestructure/config/config');
const container = require('@infraestructure/config/container');
const { ACCESS_TOKEN } = require('@infraestructure/utils/constants');

const userRepo = container.resolve('userRepo');
const options = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromExtractors([
		(req) => req.cookies[ACCESS_TOKEN],
	]),
	passReqToCallback: true, // Agregado para que se pase req al callback
};

const JWTStrategy = new Strategy(options, async (req, payload, done) => {
	try {
		const user = await userRepo.findById(payload.sub, {
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
