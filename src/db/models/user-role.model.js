const { Model, DataTypes } = require('sequelize');

const USER_ROLE_TABLE = 'user_roles';

const UserRoleSchema = {
	userId: {
		allowNull: false,
		filed: 'user_id',
		type: DataTypes.INTEGER,
	},
	roleId: {
		allowNull: false,
		filed: 'role_id',
		type: DataTypes.INTEGER,
	},
};

class UserRole extends Model {
	static associate(models) {}

	static config(sequelize) {
		return {
			sequelize,
			tableName: USER_ROLE_TABLE,
			modelName: 'UserRole',
			timestamps: true,
		};
	}
}

module.exports = { UserRole, UserRoleSchema, USER_ROLE_TABLE };
