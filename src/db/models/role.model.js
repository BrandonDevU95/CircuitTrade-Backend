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
		set(value) {
			// Normalización automática
			this.setDataValue(
				'name',
				value.toLowerCase().trim().replace(/\s+/g, '_')
			);
		},
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
			hooks: {
				beforeSave: (role) => {
					if (role.changed('name')) {
						role.name = role.name
							.toLowerCase()
							.trim()
							.replace(/\s+/g, '_');
					}
				},
			},
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
