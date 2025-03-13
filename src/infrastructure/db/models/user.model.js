const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(100),
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING(255),
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING(100),
        unique: true,
    },
    phone: {
        allowNull: true,
        type: DataTypes.STRING(15),
    },
    roleId: {
        allowNull: false,
        field: 'role_id',
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'id',
        },
        onUpdate: 'CASCADE', // Si se actualiza el rol, se actualiza en cascada
        onDelete: 'RESTRICT', // No eliminar roles si hay usuarios asociados
    },
    companyId: {
        allowNull: false,
        field: 'company_id',
        type: DataTypes.INTEGER,
        references: {
            model: 'companies',
            key: 'id',
            onUpdate: 'CASCADE', // Si se actualiza la empresa, se actualiza en cascada
            onDelete: 'RESTRICT', // No eliminar empresas si hay usuarios asociados
        },
    },
    isActive: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
};

class User extends Model {
    static associate(models) {
        this.belongsTo(models.Company, {
            as: 'company',
            foreignKey: 'companyId',
        });
        this.belongsTo(models.Role, { as: 'role', foreignKey: 'roleId' });
        this.hasOne(models.RefreshToken, {
            as: 'refreshToken',
            foreignKey: 'userId',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['email'],
                },
                {
                    fields: ['company_id'],
                },
            ],
        };
    }
}

module.exports = { User, UserSchema, USER_TABLE };
