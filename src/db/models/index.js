const { User, UserSchema } = require('./user.model');
const { Product, ProductSchema } = require('./product.model');
const { Order, OrderSchema } = require('./order.model');
const { OrderDetail, OrderDetailSchema } = require('./order-detail.model');

function setupModels(sequelize) {
	User.init(UserSchema, User.config(sequelize));
	Product.init(ProductSchema, Product.config(sequelize));
	Order.init(OrderSchema, Order.config(sequelize));
	OrderDetail.init(OrderDetailSchema, OrderDetail.config(sequelize));

	// Asociaciones
	User.associate(sequelize.models);
	Product.associate(sequelize.models);
	Order.associate(sequelize.models);
	OrderDetail.associate(sequelize.models);
}

module.exports = setupModels;
