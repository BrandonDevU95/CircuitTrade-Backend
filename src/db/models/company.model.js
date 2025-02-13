const { Model, DataTypes } = require('sequelize');

const COMPANY_TABLE = 'companies';

const CompanySchema = {
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
	rfc: {
		allowNull: false,
		type: DataTypes.STRING(13),
		maxLength: 13,
		unique: true,
		set(value) {
			// Se usa el método helper para normalizar el RFC.
			// Esto centraliza la transformación y evita duplicación.
			this.setDataValue('rfc', this.constructor.normalizeRfc(value));
		},
	},
	address: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	phone: {
		allowNull: false,
		type: DataTypes.STRING(20),
		maxLength: 20,
		validate: {
			is: /^[+0-9]\d{9,14}$/,
		},
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
		set(value) {
			// Se usa el método helper para normalizar el email.
			this.setDataValue('email', this.constructor.normalizeEmail(value));
		},
	},
	type: {
		allowNull: false,
		type: DataTypes.ENUM('supplier', 'buyer', 'hybrid'),
	},
};

class Company extends Model {
	static associate(models) {
		this.hasMany(models.User, {
			foreignKey: 'companyId',
			as: 'users',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: COMPANY_TABLE,
			modelName: 'Company',
			timestamps: true,
			indexes: [
				{
					unique: true,
					name: 'unique_company_composite', // Índice compuesto
					fields: ['name', 'rfc'],
				},
				{
					unique: true,
					fields: ['rfc'], // Índice único para RFC
				},
				{
					unique: true,
					fields: ['email'], // Índice único para email
				},
			],
			hooks: {
				beforeSave: (company) => {
					// Se utiliza la función helper para normalizar
					// los campos 'email' y 'rfc' en el hook, centralizando la lógica.
					if (company.changed('email') && company.email) {
						company.email = Company.normalizeEmail(company.email);
					}
					if (company.changed('rfc') && company.rfc) {
						company.rfc = Company.normalizeRfc(company.rfc);
					}
				},
			},
		};
	}

	// Métodos helper para centralizar la normalización de datos.
	static normalizeEmail(email) {
		return email.toLowerCase().trim();
	}

	static normalizeRfc(rfc) {
		return rfc
			.toUpperCase()
			.replace(/[^A-Z0-9&Ñ]/g, '')
			.trim();
	}
}

module.exports = { Company, CompanySchema, COMPANY_TABLE };
