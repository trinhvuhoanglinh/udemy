const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(config.MYSQL_URL);

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
