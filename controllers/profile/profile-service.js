const connection = require('../../services/mysql');
const config = require('../../config');
const bcrypt = require('bcrypt');



const getUserInfo = async (req, res, next) => {
    const user = await connection.queryOne('SELECT * FROM users WHERE _id=? LIMIT 1', [req.user_id]);
    if (!user) {
        res.send({ code: 1001, message: 'Loi xac thuc' });
        return;
    }
    // const learningcourses = await connection.query('SELECT * FROM learningcourses WHERE user_id=? LIMIT 1', [req.user_id]);
    // const wishlist = await connection.queryOne('SELECT * FROM wishlist WHERE user_id=? LIMIT 1', [req.user_id]);
    const learningcourses = [];
    const wishlist = [];
    const noti = [];
    const verified = true;
    user.learningcourses = learningcourses;
    user.wishlist = wishlist;
    user.notis = noti;
    user.verified = verified;
    res.send({ code: 200, message: 'Thanh cong', user });

}

const editProfile = async (req, res, next) => {
    const { biography, linkedin, twitter, username, website, youtube } = req.body;
    await connection.query(
        `UPDATE users 
        SET biography = ?, linkedin = ?, twitter = ?, username = ?, website = ?, youtube = ?
        WHERE _id =? `,
        [biography, linkedin, twitter, username, website, youtube, req.user_id]
    );

    const user = await connection.queryOne('SELECT * FROM users WHERE _id=? LIMIT 1', [req.user_id]);
    if (!user) {
        res.send({ code: 1001, message: 'Loi xac thuc' });
        return;
    }
    // const learningcourses = await connection.query('SELECT * FROM learningcourses WHERE user_id=? LIMIT 1', [req.user_id]);
    // const wishlist = await connection.queryOne('SELECT * FROM wishlist WHERE user_id=? LIMIT 1', [req.user_id]);
    res.send({ code: 200, message: 'Thanh cong', profile: req.body });


}

// why????????

const changePassword = async (req, res, next) => {
    const { password, newPassword } = req.body;

    const user = await connection.queryOne('SELECT * FROM users WHERE _id=? LIMIT 1', [req.user_id]);
    if (!user) {
        res.send({ code: 1001, message: 'Tai khoan khong ton tai' });
        return;
    }
    console.log(user.password);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        res.send({ code: 1001, message: 'Sai password' });
        return;
    } else {
        const hashedNewPasssword = await bcrypt.hash(newPassword, 10)
        await connection.query(
            'UPDATE users SET password = ? WHERE _id =?', [hashedNewPasssword, req.user_id]
        );
        delete user.password;// xoa pass truoc khi tra ve user cho client
        res.send({ code: 200, message: 'Doi password thanh cong', user });
        console.log(hashedNewPasssword);
      
    }


}

const setPaypalId = async (req, res, next) => {

    const { paypalid } = req.body;

    const user = await connection.queryOne('SELECT * FROM users WHERE _id=? LIMIT 1', [req.user_id]);
    if (!user) {
        res.send({ code: 1001, message: 'Tai khoan khong ton tai' });
        return;
    }
    await connection.query('UPDATE users SET paypalid = ? WHERE _id =?', [paypalid, req.user_id]);
    res.send({ code: 200, message: 'Cap nhat paypalId thanh cong', user });
      

} 

    // 629f58efdad1421c4679df8a ID user test


module.exports = {
    getUserInfo,
    editProfile,
    changePassword,
    setPaypalId,


}