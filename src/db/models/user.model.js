const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	name: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	password: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
	},
	phone: {
		allowNull: true,
		type: DataTypes.STRING,
	},
	companyId: {
		allowNull: false,
		field: 'company_id',
		type: DataTypes.INTEGER,
	},
};

class User extends Model {
	static associate(models) {
		this.belongsTo(models.Company, {
			foreignKey: 'companyId',
			as: 'company',
		});
		this.belongsToMany(models.Role, {
			through: 'user_roles',
			foreignKey: 'userId',
			otherKey: 'roleId',
			as: 'roles',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: USER_TABLE,
			modelName: 'User',
			timestamps: true,
		};
	}
}

module.exports = { User, UserSchema, USER_TABLE };
