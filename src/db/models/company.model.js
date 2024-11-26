const { Model, DataTypes } = require('sequelize');

const COMPANY_TABLE = 'Companies';

const CompanySchema = {
	companyId: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
        field: 'company_id',
		type: DataTypes.INTEGER,
	},
	name: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	address: {
		type: DataTypes.STRING,
	},
	phone_number: {
		type: DataTypes.STRING,
	},
	taxId: {
        field: 'tax_id',
		type: DataTypes.STRING,
	},
};

class Company extends Model {
	static associate(models) {
		// associations
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: COMPANY_TABLE,
			modelName: 'Company',
			timestamps: true,
		};
	}
}

module.exports = { COMPANY_TABLE, CompanySchema, Company };
