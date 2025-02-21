const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('../../../config/config');

const options = {
	secretOrKey: config.jwtSecret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const JWTStrategy = new Strategy(options, async (tokenPayload, cb) => {
	try {
		if (tokenPayload) {
			return cb(null, tokenPayload);
		}
		cb(null, false);
	} catch (error) {
		cb(error);
	}
});

module.exports = JWTStrategy;
