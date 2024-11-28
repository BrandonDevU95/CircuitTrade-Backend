const { Model, DataTypes } = require('sequelize');

const ORDER_DETAIL_TABLE = 'order_details';

const OrderDetailSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	orderId: {
		allowNull: false,
		type: DataTypes.INTEGER,
		references: {
			model: 'orders',
			key: 'id',
		},
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	},
	productId: {
		allowNull: false,
		type: DataTypes.INTEGER,
		references: {
			model: 'products',
			key: 'id',
		},
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	},
	quantity: {
		allowNull: false,
		type: DataTypes.INTEGER,
	},
	unitPrice: {
		allowNull: false,
		type: DataTypes.DECIMAL(10, 2),
	},
};

class OrderDetail extends Model {
	static associate(models) {
		this.belongsTo(models.Order, { as: 'order', foreignKey: 'orderId' });
		this.belongsTo(models.Product, {
			as: 'product',
			foreignKey: 'productId',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ORDER_DETAIL_TABLE,
			modelName: 'OrderDetail',
			timestamps: false,
		};
	}
}

module.exports = { OrderDetail, OrderDetailSchema, ORDER_DETAIL_TABLE };
