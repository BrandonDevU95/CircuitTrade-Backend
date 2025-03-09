const bcrypt = require('bcrypt');

async function encryptPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = { encryptPassword };
