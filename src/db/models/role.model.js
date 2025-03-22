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
		type: DataTypes.STRING(255),
		validate: {
			len: [3, 255],
		},
	},
};

class Role extends Model {
	static associate(models) {
		this.hasMany(models.User, { as: 'users', foreignKey: 'roleId' });
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ROLE_TABLE,
			modelName: 'Role',
			timestamps: true,
			indexes: [
				{
					unique: true,
					fields: ['name'],
				},
				{
					fields: ['description'],
				},
			],
		};
	}
}

module.exports = { Role, RoleSchema, ROLE_TABLE };
