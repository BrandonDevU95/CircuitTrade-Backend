const passport = require('passport');
const LocalStrategy = require('./strategies/local.strategy');
const JWTStrategy = require('./strategies/jwt.strategy');

const configureAuth = (app) => {
    // Strategies
    passport.use(LocalStrategy);
    passport.use(JWTStrategy);

    // Initialize
    app.use(passport.initialize());
};

module.exports = configureAuth;