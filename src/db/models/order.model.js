const { Model, DataTypes } = require('sequelize');

const ORDER_TABLE = 'orders';

const OrderSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	userId: {
		allowNull: false,
		type: DataTypes.INTEGER,
		references: {
			model: 'users',
			key: 'id',
		},
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
	},
	total: {
		allowNull: false,
		type: DataTypes.DECIMAL(10, 2),
	},
	status: {
		allowNull: false,
		type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
		defaultValue: 'pending',
	},
};

class Order extends Model {
	static associate(models) {
		this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
		this.belongsToMany(models.Product, {
			as: 'products',
			through: models.OrderDetail,
			foreignKey: 'orderId',
			otherKey: 'productId',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ORDER_TABLE,
			modelName: 'Order',
			timestamps: true,
		};
	}
}

module.exports = { Order, OrderSchema, ORDER_TABLE };
