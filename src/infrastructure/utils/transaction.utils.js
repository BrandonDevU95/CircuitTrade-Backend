// utils/transactionHelper.js
const sequelize = require('@infrastructure/db');

async function runInTransaction(callback, transaction = null) {
    if (!transaction) {
        return sequelize.transaction(async (t) => callback(t));
    }
    return callback(transaction);
}

module.exports = { runInTransaction };
