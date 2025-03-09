require('dotenv').config();
require('module-alias/register');
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');

// Cargar contenedor de dependencias y conexión a la DB
const container = require('./src/infrastructure/config/container');
const sequelize = require('./src/infrastructure/db/sequelize.config');

const app = express();

app.set('trust proxy', 1);

// Middlewares básicos
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 900000, // 15 minutos
        max: 500,
        skip: (req) => req.path === '/health',
    })
);
app.use(cors());
app.use(morgan('combined'));

// Ruta de Health
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: process.env.VERSION,
        environment: process.env.NODE_ENV,
    });
});

// Registrar rutas de usuarios usando el controlador inyectado desde el contenedor
const { createUserRouter } = require('./src/infrastructure/presentation/routes/users.routes');
const userController = container.resolve('userController');
app.use('/users', createUserRouter({ userController }));

// Middleware de error genérico (para simplificar el ejemplo)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

// Arranque de la aplicación
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

startServer();

// Manejadores para cerrar el servidor al recibir señales de terminación
function shutdown(signal) {
    console.log(`${signal} signal received. Closing server...`);
    process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
