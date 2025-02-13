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
			// Se utiliza el método helper normalizeName para centralizar la normalización del nombre.
			this.setDataValue('name', this.constructor.normalizeName(value));
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
					if (role.changed('name') && role.name) {
						// Se aplica la normalización a través del método helper en el hook.
						role.name = Role.normalizeName(role.name);
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

	// Método helper para centralizar la normalización del nombre
	static normalizeName(name) {
		return name.toLowerCase().trim().replace(/\s+/g, '_');
	}
}

module.exports = { Role, RoleSchema, ROLE_TABLE };
