const { Company, CompanySchema } = require('./company.model');

function setupModels(sequelize) {
	Company.init(CompanySchema, Company.config(sequelize));
	// User.init(UserSchema, User.config(sequelize));
	// Product.init(ProductSchema, Product.config(sequelize));
	// Order.init(OrderSchema, Order.config(sequelize));
	// OrderDetail.init(OrderDetailSchema, OrderDetail.config(sequelize));

	// Asociaciones
	// User.associate(sequelize.models);
	// Product.associate(sequelize.models);
	// Order.associate(sequelize.models);
	// OrderDetail.associate(sequelize.models);
}

module.exports = setupModels;
