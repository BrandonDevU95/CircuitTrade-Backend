const { config } = require('@config/config');

const cookieOptions = {
    httpOnly: true,
    secure: config.node.env === 'production', // Solo en HTTPS si está en producción
    sameSite: 'Strict', // Evita ataques CSRF
    maxAge: 1000 * 60 * 15, // 15 minutos de expiración
};

module.exports = cookieOptions;