const { Model, DataTypes } = require('sequelize');

const PRODUCT_TABLE = 'products';

const ProductSchema = {
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
	description: {
		allowNull: true,
		type: DataTypes.TEXT,
	},
	price: {
		allowNull: false,
		type: DataTypes.DECIMAL(10, 2),
	},
	stock: {
		allowNull: false,
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
};

class Product extends Model {
	static associate(models) {
		this.belongsToMany(models.Order, {
			as: 'orders',
			through: models.OrderDetail,
			foreignKey: 'productId',
			otherKey: 'orderId',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: PRODUCT_TABLE,
			modelName: 'Product',
			timestamps: true,
		};
	}
}

module.exports = { Product, ProductSchema, PRODUCT_TABLE };
