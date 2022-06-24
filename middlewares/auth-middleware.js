const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = ((req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.send({ code: 1001, message: 'Khong xac thuc' });
        return;
    }
    const access_token = authorization.substring(7);
    try {
        const decodedToken = jwt.verify(access_token, config.JWT_SECRET);
        req.user_id = decodedToken._id;
        next()
    } catch (error) {
        res.send({ code: 1001, message: 'Khong xac thuc' });
        return;
    }
});
module.exports = { authMiddleware };
