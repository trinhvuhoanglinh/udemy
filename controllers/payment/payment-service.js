const connection = require('../../services/mysql');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');// sinh id ngau nhien
const type = require('../../const');




const getPayment = async (req, res, next) => {

    console.log(req.query)
    const page = Number(req.query.page);
    console.log(page)
    // const getPayment = await connection.query('SELECT * FROM payment WHERE user=?', [req.user_id]);
    const getPayment = await connection.query('SELECT * FROM payment WHERE user=? ORDER BY createdAt DESC LIMIT ? OFFSET ?', [req.user_id, 8, 8 * (page - 1)]);

    res.send({ code: 200, payments: getPayment });
    return;
}
const deposit = async (req, res, next) => {

    const paymentId = uuidv4().replace(/-/g, "").substring(0, 24);

    await connection.transaction(async () => {
        await connection.queryOne('UPDATE users SET creditbalance=creditbalance+? WHERE _id=?', [req.body.money, req.user_id])
        await connection.queryOne('INSERT INTO payment (_id, user, money, type) VALUE (?, ?, ?, ?)', [paymentId, req.user_id, req.body.money, type.typeOfPaymentDeposit]);
    })
    res.send({ code: 200, mesenger: 'Nap tien thanh cong' });
}

const withdraw = async (req, res, next) => {

    const paymentId = uuidv4().replace(/-/g, "").substring(0, 24);
    const user = await connection.queryOne('SELECT * FROM users WHERE _id=?', [req.user_id])
    if (user.creditbalance < req.body.money) {
        res.send({ code: 400, mesenger: 'Khong du tien de rut' });
    } else {
        const money = user.creditbalance - req.body.money;
        await connection.transaction(async () => {
            await connection.queryOne('UPDATE users SET creditbalance=? WHERE _id=?', [money, user._id])
            await connection.queryOne('INSERT INTO payment (_id, user, money, type) VALUE (?, ?, ?, ?)', [paymentId, user._id, req.body.money, type.typeOfPaymentWithdraw])
        })
        res.send({ code: 200, mesenger: 'Rut tien thanh cong' });
    }
    return;
}

const deletePayment = async (req, res, next) => {
    const paymentId = req.body._id;
    await connection.queryOne('DELETE FROM payment WHERE _id=?', [paymentId]);
    res.send({ code: 200, mesenger: 'Xoa lich su payment thanh cong' });
    return;
    
}
// 629f58efdad1421c4679df8a ID user test

module.exports = {
    getPayment,
    withdraw,
    deposit,
    deletePayment,
}