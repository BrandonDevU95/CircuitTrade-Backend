// Definición de niveles personalizados
const customLevels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warn: 4,
    http: 5,  // Nivel especial para Morgan
    info: 6,
    debug: 7
};

// Definición de colores para cada nivel
const customColors = {
    emerg: 'red',
    alert: 'red',
    crit: 'red',
    error: 'red',
    warn: 'yellow',
    http: 'magenta',
    info: 'green',
    debug: 'blue'
};

module.exports = { customLevels, customColors };