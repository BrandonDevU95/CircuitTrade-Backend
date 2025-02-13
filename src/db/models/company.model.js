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
			this.setDataValue('rfc', value.toUpperCase().trim());
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
			this.setDataValue('email', value.toLowerCase().trim());
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
					name: 'unique_company_composite', // Nombre descriptivo
					fields: ['name', 'rfc'],
				},
				{
					unique: true,
					fields: ['rfc'], // Índice único individual para RFC
				},
				{
					unique: true,
					fields: ['email'], // Índice único individual para email
				},
			],
			hooks: {
				beforeSave: (company) => {
					if (company.changed('email')) {
						company.email = company.email.toLowerCase().trim();
					}
					if (company.changed('rfc')) {
						company.rfc = company.rfc
							.toUpperCase()
							.replace(/[^A-Z0-9&Ñ]/g, '')
							.trim();
					}
				},
			},
		};
	}
}

module.exports = { Company, CompanySchema, COMPANY_TABLE };
