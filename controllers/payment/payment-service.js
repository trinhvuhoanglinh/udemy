const pool = require('../../services/mysql');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');// sinh id ngau nhien
const { PAYMENT_TYPE } = require('../../const');

const getPayment = async (req, res, next) => {
    const page = Number(req.query.page);
    const [payments] = await pool.query('SELECT * FROM payment WHERE user=? ORDER BY createdAt DESC LIMIT ? OFFSET ?', [req.user_id, 8, 8 * (page - 1)]);
    res.send({ code: 200, payments });
    return;
}

const deposit = async (req, res, next) => {
    const paymentId = uuidv4().replace(/-/g, "").substring(0, 24);
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        await connection.query('UPDATE users SET creditbalance=creditbalance+? WHERE _id=?', [req.body.money, req.user_id])

        await connection.query('INSERT INTO payment (_id, user, money, type) VALUE (?, ?, ?, ?)', [paymentId, req.user_id, req.body.money, PAYMENT_TYPE.DEPOST]);
        await connection.commit()
    } catch (error) {
        await connection.rollback()
    }
    connection.release()
    res.send({ code: 200, mesenger: 'Nap tien thanh cong' });
}

const withdraw = async (req, res, next) => {
    const paymentId = uuidv4().replace(/-/g, "").substring(0, 24);
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const [updateResult] = await connection.query('UPDATE users SET creditbalance = creditbalance - ? WHERE _id=? AND creditbalance  > ?', [req.body.money, req.user_id, req.body.money]);
        if (updateResult.changedRows === 0) {
            await connection.rollback();
            connection.release();
            res.send({ code: 400, mesenger: 'Khong du so du' });
            return;
        }
        await connection.query('INSERT INTO payment (_id, user, money, type) VALUE (?, ?, ?, ?)', [paymentId, req.user_id, req.body.money, PAYMENT_TYPE.WITHDRAW])
        await connection.commit();
        res.send({ code: 200, mesenger: 'Rut tien thanh cong' });
    } catch (error) {
        await connection.rollback();
    }
    connection.release();
}

const deletePayment = async (req, res, next) => {
    const paymentId = req.body._id;
    await pool.query('DELETE FROM payment WHERE _id=? AND user=?', [paymentId, req.user_id]);
    res.send({ code: 200, mesenger: 'Xoa lich su payment thanh cong' });
    return;
}
const takeCourse = async (req, res, next) => {
}

// 629f58efdad1421c4679df8a ID user test

module.exports = {
    getPayment,
    withdraw,
    deposit,
    deletePayment,
    takeCourse,

}