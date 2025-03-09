// Modelo Sequelize para la tabla "users". Sin lógica de negocio.
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING(100),
            validate: { len: [3, 100] },
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING(255),
            validate: { len: [6, 255] },
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING(100),
            unique: true,
        },
        phone: {
            allowNull: true,
            type: DataTypes.STRING(15),
            validate: { is: /^\+?[0-9]{7,15}$/ },
        },
        roleId: {
            allowNull: false,
            field: "role_id",
            type: DataTypes.INTEGER,
            references: { model: "roles", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        companyId: {
            allowNull: false,
            field: "company_id",
            type: DataTypes.INTEGER,
            references: { model: "companies", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        isActive: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: "users",
        modelName: "User",
        timestamps: true,
        indexes: [
            { unique: true, fields: ["email"] },
            { fields: ["company_id"] }
        ]
    });

    User.associate = function (models) {
        // User.belongsTo(models.Company, { as: "company", foreignKey: "companyId" });
        // User.belongsTo(models.Role, { as: "role", foreignKey: "roleId" });
        // User.hasOne(models.RefreshToken, { as: "refreshToken", foreignKey: "userId" });
    };

    return User;
};
