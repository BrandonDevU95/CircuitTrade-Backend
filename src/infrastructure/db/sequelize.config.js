const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: console.log,
});

// Cargar modelos manualmente (o usando un loader dinámico)
const models = {};
models.User = require('./models/user.model')(sequelize, DataTypes);
// Aquí cargarías otros modelos: Role, Company, RefreshToken, etc.

// Ejecutar asociaciones, si existen
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.models = models;

module.exports = sequelize;
