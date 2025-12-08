const sql = require('mssql');

const config = process.env.SQL_CONNECTION_STRING;

async function connect() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Database connection failed', err);
        throw err;
    }
}

module.exports = {
    connect,
    sql
};
