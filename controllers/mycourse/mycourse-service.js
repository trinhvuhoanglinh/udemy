
const { v4: uuidv4 } = require('uuid');// sinh id ngau nhien
const pool = require('../../services/mysql');

const getMyCourses = async (req, res, next) => {
    const user_id = req.user_id;
    const [listCourses] = await pool.query('SELECT * FROM courses WHERE lecturer = ?', [user_id]);
    res.send(listCourses);
    return;
}

const createCourse = async (req, res, next) => {
    const courseName = req.body.coursename;
    const user_id = req.user_id;
    const _id = uuidv4().replace(/-/g, "").substring(0, 24);
    await pool.query("INSERT INTO courses(_id, name, lecturer) VALUES (?,?,?)", [_id, courseName, user_id]);
    const [[newCourse]] = await pool.query('SELECT * FROM courses WHERE _id=?', [_id]);
    res.send({ code: 200, course: newCourse });
    return;

}


module.exports = {
    getMyCourses,
    createCourse,

}
