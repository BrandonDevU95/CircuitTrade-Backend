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
	},
	address: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	phone: {
		allowNull: false,
		type: DataTypes.STRING(20),
		maxLength: 20,
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
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
		};
	}
}

module.exports = { Company, CompanySchema, COMPANY_TABLE };
