// utils/transactionHelper.js
const sequelize = require('@db');

async function runInTransaction(callback, transaction = null) {
    if (!transaction) {
        return sequelize.transaction(async (t) => callback(t));
    }
    return callback(transaction);
}

module.exports = { runInTransaction };
