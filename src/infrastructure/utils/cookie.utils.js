const { config } = require('@infrastructure/config/config');

const accessCookieOptions = {
    httpOnly: true,
    secure: config.node.env === 'production', // Solo en HTTPS si está en producción
    sameSite: 'Strict', // Evita ataques CSRF
    maxAge: 1000 * 60 * 15, // 15 minutos de expiración
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: config.node.env === 'production', // Solo en HTTPS si está en producción
    sameSite: 'Strict', // Evita ataques CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días de expiración
};

module.exports = { accessCookieOptions, refreshCookieOptions };