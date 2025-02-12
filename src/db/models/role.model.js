const { Model, DataTypes } = require('sequelize');

const ROLE_TABLE = 'roles';

const RoleSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	name: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
	},
	description: {
		allowNull: false,
		type: DataTypes.STRING,
	},
};

class Role extends Model {
	static associate(models) {
		this.belongsToMany(models.User, {
			through: 'user_roles',
			foreignKey: 'roleId',
			otherKey: 'userId',
			as: 'users',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ROLE_TABLE,
			modelName: 'Role',
			timestamps: true,
		};
	}
}

module.exports = { Role, RoleSchema, ROLE_TABLE };
