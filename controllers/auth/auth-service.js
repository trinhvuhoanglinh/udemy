const { v4: uuidv4 } = require('uuid');// sinh id ngau nhien
const connection = require('../../services/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const mail = require('../../services/mail');
const redis = require('../../services/redis');

const signup = async (req, res, next) => {
    const { email, password } = req.body;

    const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    redis.set(email, JSON.stringify({ otp, password }), "EX", 5 * 60);// time exprire 5 min

    res.send({ code: 200, message: 'Please check your email to continue' });
    mail.sendEmail(email, 'sigup verify', otp);
}

const signupVerify = async (req, res, next) => {
    const { email, otp } = req.body;

    const valueInRedisStr = await redis.get(email);
    if (!valueInRedisStr) {
        res.send({ code: 1001, message: 'Email da ton tai' });
        return;
    }
    const valueInRedis = JSON.parse(valueInRedisStr);
    if (otp !== valueInRedis.otp) {
        res.send({ code: 1001, message: 'Loi roi sai otp' });
        return;
    }

    const hashedPasssword = await bcrypt.hash(valueInRedis.password, 10)
    const _id = uuidv4().replace(/-/g, "").substring(0, 24);

    await connection.query("INSERT INTO users(_id,username,email,password) VALUES (?,?,?,?)",
        [_id, email, email, hashedPasssword]);
    await redis.del(email);
    res.send({ code: 200, message: 'Xac thuc thanh cong' });
    return;
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await connection.queryOne('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
    if (!user) {
        res.send({ code: 1001, message: 'Sai email' });
        return;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        res.send({ code: 1001, message: 'Sai pass' });
        return;
    }
    delete user.password;// xoa pass truoc khi tra ve user cho client


    const access_token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: 30 * 24 * 60 * 60 });
   
    user.learningcourses = [];// link data sau
    user.wishlist = [];
    user.notis = [];
    user.verified = true;
    // user.creditbalance = 0;
    user.mycourses = [];
    res.send({ code: 200, message: 'login sucsessful', user, access_token });
    return;
}

module.exports = {
    signup,
    login,
    signupVerify,

}
