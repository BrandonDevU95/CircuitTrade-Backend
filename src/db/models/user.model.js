const { Model, DataTypes } = require('sequelize');
const { hashPassword } = require('./../../lib/auth.helper');

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
		type: DataTypes.STRING(100),
		validate: {
			len: [3, 100],
		},
	},
	password: {
		allowNull: false,
		type: DataTypes.STRING(255),
		validate: {
			len: [6, 255],
		},
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING(100),
		unique: true,
		set(value) {
			// Se utiliza el método helper 'normalizeEmail' para centralizar la transformación
			this.setDataValue('email', User.normalizeEmail(value));
		},
	},
	phone: {
		allowNull: true,
		type: DataTypes.STRING(15),
		validate: {
			is: /^\+?[0-9]{7,15}$/,
		},
	},
	roleId: {
		allowNull: false,
		field: 'role_id',
		type: DataTypes.INTEGER,
		references: {
			model: 'roles',
			key: 'id',
		},
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT', // No eliminar roles si hay usuarios asociados
	},
	companyId: {
		allowNull: false,
		field: 'company_id',
		type: DataTypes.INTEGER,
		references: {
			model: 'companies',
			key: 'id',
		},
	},
	isActive: {
		allowNull: false,
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
};

class User extends Model {
	static associate(models) {
		this.belongsTo(models.Role, { as: 'role', foreignKey: 'roleId' });
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: USER_TABLE,
			modelName: 'User',
			timestamps: true,
			hooks: {
				beforeSave: async (user) => {
					if (user.changed('email') && user.email) {
						// Se utiliza el método helper para normalizar el email
						user.email = User.normalizeEmail(user.email);
					}
					if (user.changed('phone') && user.phone) {
						// Se utiliza el método helper para normalizar el teléfono
						user.phone = User.normalizePhone(user.phone);
					}
					if (user.changed('password') && user.password) {
						user.password = await hashPassword(user.password);
					}
				},
			},
			indexes: [
				{
					unique: true,
					fields: ['email'],
				},
				{
					fields: ['company_id'],
				},
			],
		};
	}

	// Método helper para centralizar la normalización del email
	static normalizeEmail(email) {
		return email.toLowerCase().trim();
	}

	// Método helper para centralizar la normalización del teléfono
	static normalizePhone(phone) {
		return phone.replace(/[^0-9+]/g, '');
	}
}

module.exports = { User, UserSchema, USER_TABLE };
