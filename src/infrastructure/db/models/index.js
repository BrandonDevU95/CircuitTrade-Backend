const { Company, CompanySchema } = require('./company.model');
const { User, UserSchema } = require('./user.model');
const { Role, RoleSchema } = require('./role.model');
const { RefreshToken, RefreshTokenSchema } = require('./refreshToken.model');

function setupModels(sequelize) {
	Company.init(CompanySchema, Company.config(sequelize));
	User.init(UserSchema, User.config(sequelize));
	Role.init(RoleSchema, Role.config(sequelize));
	RefreshToken.init(RefreshTokenSchema, RefreshToken.config(sequelize));

	// Asociaciones
	Company.associate(sequelize.models);
	User.associate(sequelize.models);
	Role.associate(sequelize.models);
	RefreshToken.associate(sequelize.models);
}

module.exports = setupModels;
