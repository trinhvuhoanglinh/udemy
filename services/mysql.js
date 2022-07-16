const mysql = require('mysql2/promise');
const config = require('../config');
const pool = mysql.createPool({
  uri: config.MYSQL_URL,
  connectionLimit: 10,
  waitForConnections: true,
});

// const query = (sql, params) => new Promise((resolve, reject) => {
//   connection.query(sql, params, (err, result) => {
//     if (err) {
//       reject(err);
//       return;
//     }
//     resolve(result);
//     return;
//   });
// });

// const queryOne = async (sql, params) => {
//   const result = await query(sql, params);
//   return result[0];
// }

// const commit = () => new Promise((resolve, reject) => {
//   connection.commit(err => {
//     if (err) {
//       reject(err);
//       return;
//     }
//     resolve();
//     return;
//   });
// });

// const rollback = () => new Promise((resolve, reject) => {
//   connection.rollback(err => {
//     if (err) {
//       reject(err);
//       return;
//     }
//     resolve();
//     return;
//   });
// });

// const beginTransaction = () => new Promise((resolve, reject) => {
//   connection.beginTransaction(err => {
//     if (err) {
//       reject(err);
//       return;
//     }
//     resolve();
//     return;
//   });
// });

// const transaction = async (executor) => {
//   await beginTransaction();
//   try {
//     await executor();
//     await commit();
//   } catch (error) {
//     await rollback();
//     throw error;
//   }
// }

module.exports = pool;
