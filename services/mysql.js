const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(config.MYSQL_URL);

connection.connect();

const query = (sql, params) => new Promise((resolve, reject) => {
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

const commit = () => new Promise((resolve, reject) => {
  connection.commit(err => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
    return;
  });
});

const rollback = () => new Promise((resolve, reject) => {
  connection.rollback(err => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
    return;
  });
});

const beginTransaction = () => new Promise((resolve, reject) => {
  connection.beginTransaction(err => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
    return;
  });
});

const transaction = async (executor) => {
  await beginTransaction();
  try {
    await executor();
    await commit();
  } catch (error) {
    await rollback();
    throw error;
  }
}

const test = () => {
  connection.beginTransaction(function (err) {
    if (err) { throw err; }
    connection.query('INSERT INTO test SET age=1', [], function (error, results, fields) {
      if (error) {
        return connection.rollback(function () {
          throw error;
        });
      }

      connection.query('INSERT INTO test SET age=2', [], function (error, results, fields) {
        if (error) {
          return connection.rollback(function () {
            throw error;
          });
        }
        // connection.commit(function (err) {
        //   if (err) {
        //     return connection.rollback(function () {
        //       throw err;
        //     });
        //   }
        //   console.log('success!');
        // });
      });
    });
  });
}

setInterval(() => {
  test()
}, 3000)

module.exports = { query, queryOne, transaction }
