const { Company, CompanySchema } = require('./company.model');
const { User, UserSchema } = require('./user.model');
const { Role, RoleSchema } = require('./role.model');
const { UserRole, UserRoleSchema } = require('./user-role.model');

function setupModels(sequelize) {
	Company.init(CompanySchema, Company.config(sequelize));
	User.init(UserSchema, User.config(sequelize));
	Role.init(RoleSchema, Role.config(sequelize));
	UserRole.init(UserRoleSchema, UserRole.config(sequelize));

	// Asociaciones
	Company.associate(sequelize.models);
	User.associate(sequelize.models);
	Role.associate(sequelize.models);
	UserRole.associate(sequelize.models);
}

module.exports = setupModels;
