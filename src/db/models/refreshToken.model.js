const { Model, DataTypes } = require('sequelize');

const REFRESH_TOKEN = 'refresh_tokens';

const RefreshTokenSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	token: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
	},
	userId: {
		allowNull: false,
		type: DataTypes.INTEGER,
		unique: true,
	},
	expiresAt: {
		allowNull: false,
		type: DataTypes.DATE,
	},
};

class RefreshToken extends Model {
	static associate(models) {
		this.belongsTo(models.User, {
			foreignKey: 'userId',
			as: 'user',
			allowNull: false,
			onDelete: 'CASCADE',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: REFRESH_TOKEN,
			modelName: 'RefreshToken',
			timestamps: true,
			hooks: {
				beforeSave: async (refreshToken) => {
					if (refreshToken.changed('token')) {
						refreshToken.token = refreshToken.token.trim();
					}
				},
			},
			indexes: [
				{
					unique: true,
					fields: ['token'],
				},
				{
					unique: true,
					fields: ['userId'],
				},
				{
					fields: ['expiresAt'],
				},
			],
		};
	}
}

module.exports = { RefreshToken, RefreshTokenSchema, REFRESH_TOKEN };
