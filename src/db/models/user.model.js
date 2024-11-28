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
	email: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
	},
	password: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	role: {
		allowNull: false,
		type: DataTypes.ENUM('admin', 'buyer'),
		defaultValue: 'buyer',
	},
};

class User extends Model {
	static associate(models) {
		this.hasMany(models.Order, { as: 'orders', foreignKey: 'userId' });
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
