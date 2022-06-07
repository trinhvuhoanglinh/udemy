const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'udemy',
    port: 3306,
});

connection.connect();

const query = (sql, params) => new Promise((resolve, reject) => {
    console.log({ sql, params })

    connection.query(sql, params, (err, result) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(result);
        return;
    });
});

const queryOne = async (sql, params) => {
    const result = await query(sql, params);
    return result[0];
}
// module.exports = 1
module.exports = { query, queryOne }
