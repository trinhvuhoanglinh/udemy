const { COURSE_SORT } = require('../../const');
const pool = require('../../services/mysql');
// const config = require('../../config');

const genreAll = async (req, res, next) => {
    const [genres] = await pool.query('SELECT * FROM genres')
    const [subGenres] = await pool.query('SELECT * FROM subgenres');

    for (i = 0; i < genres.length; i++) {
        const arraySub = [];
        for (j = 0; j < subGenres.length; j++) {
            if (genres[i]._id === subGenres[j].genre) {
                arraySub.push(subGenres[j]);
                genres[i].subgenres = arraySub;
            }
        }
    }
    res.send(genres);
    return;
}


const getCoursesHomePage = async (req, res, next) => {

    const [genres] = await pool.query('SELECT * FROM genres');

    const listCourses = []
    for (const genre of genres) {
        const item = { _id: genre._id, name: genre.name };

        const [courses] = await pool.query(`SELECT courses.*,users.photo,users.username FROM courses
        INNER JOIN users ON courses.lecturer = users._id
        WHERE genre = ? LIMIT 8`, [genre._id]);
        item.courses = courses.map(course => {
            course.lecturer = { photo: course.photo, username: course.username };
            return course;
        });
        listCourses.push(item);
    }
    res.send({ code: 200, listCourses });
    return;

}


const getCoursesGenre = async (req, res, next) => {
    const { genreid } = req.params;
    const [subGenres] = await pool.query(`SELECT subgenres.*, genres.name AS genre_name FROM subgenres 
        INNER JOIN genres ON subgenres.genre = genres._id
        WHERE genre = ?`, [genreid]);
    const genre = {
        _id: genreid,
        name: subGenres[0].genre_name,
    };

    const listCourses = []
    for (const subGenre of subGenres) {
        const item = { _id: subGenre._id, name: subGenre.name };
        const [courses] = await pool.query(`SELECT courses.*,users.photo,users.username FROM courses
            INNER JOIN users ON courses.lecturer = users._id
            WHERE subgenre = ? LIMIT 8`, [subGenre._id]);
        item.courses = courses.map(course => {
            course.lecturer = { photo: course.photo, username: course.username };
            return course;
        });
        listCourses.push(item);
    }
    res.send({ code: 200, genre, listCourses });
    return;
}


const getCoursesSubgenre = async (req, res, next) => {
    const { subgenreid } = req.params;
    const level = Number(req.query.level)
    const free = req.query.free === "true"
    const sort = Number(req.query.sort) || COURSE_SORT.POPULAR
    const page = Number(req.query.page) || 1

    let sql = `SELECT courses.*, genres._id AS genre_id, genres.name AS genre_name,
    subgenres._id AS subgenre_id, subgenres.name AS subgenre_name,
    users.photo AS user_photo, users.username AS user_username
    FROM courses
    INNER JOIN subgenres ON subgenres._id = courses.subgenre
    INNER JOIN genres ON subgenres.genre = genres._id
    INNER JOIN users ON users._id = courses.lecturer
    WHERE courses.subgenre = ?`
    const params = [subgenreid]
    if (level) {
        sql = sql + " AND courses.level = ?"
        params.push(level);
    }
    if (free) {
        sql = sql + " AND courses.cost = 0"
    } else {
        sql = sql + " AND courses.cost > 0"
    }

    if (sort === COURSE_SORT.POPULAR) {
        sql = sql + " ORDER BY courses.numberofstudent DESC"
    } else if (sort === COURSE_SORT.HIGH_RATE) {
        sql = sql + " ORDER BY courses.star DESC"
    } else if (sort === COURSE_SORT.NEW) {
        sql = sql + " ORDER BY courses.createdAt DESC"
    } else if (sort === COURSE_SORT.PRICE_LOW) {
        sql = sql + " ORDER BY courses.cost ASC"
    } else if (sort === COURSE_SORT.PRICE_HIGH) {
        sql = sql + " ORDER BY courses.cost DESC"
    }

    sql = sql + " LIMIT 8 OFFSET ?"
    params.push((page - 1) * 8);

    const [courses] = await pool.query(sql, params);

    if (!courses.length) {
        res.send({})
        return;
    }

    const genre = { _id: courses[0].genre_id, name: courses[0].genre_name }
    const subgenre = { _id: courses[0].subgenre_id, name: courses[0].subgenre_name }

    res.send({
        code: 200,
        courses: courses.map(course => {
            course.lecturer = { photo: course.user_photo, username: course.user_username };
            return course;
        }),
        genre,
        subgenre
    });
    return;

}


const getCoursesRelate = async (req, res, next) => {
    const courseid = req.query.courseid;
    const lecturerid = req.query.lecturerid;
    let sql = `SELECT courses.*, users._id AS lecturer_id, users.username AS lecture_username,
    users.photo AS lecture_photo
    FROM courses
    INNER JOIN users ON users._id = courses.lecturer
    WHERE NOT courses._id = ? AND users._id = ? LIMIT ?`
    const params = [courseid, lecturerid, 4]
    const [result] = await pool.query(sql, params);

    const courses = result.map(course => {
        course.lecturer = { photo: course.user_photo, username: course.user_username };
        return course;
    });
    res.send({ code: 200, courses });
}


const getCourseInfo = async (req, res, next) => {
    const { courseid } = req.query;
    let sql = `SELECT courses.*, users._id AS lecturer_id, users.username AS lecture_username,
    users.photo AS lecture_photo, users.biography AS lecture_biography, users.linkedin AS lecturer_linkedin, 
    users.twitter AS lecturer_twitter, users.website AS lecturer_website, users.youtube AS lecturer_youtube,
    genres._id AS genre_id, genres.name AS genre_name,
    subgenres._id AS subgenre_id, subgenres.name AS subgenre_name,
    lectures._id AS lecture_id,lectures.name AS lecture_name,lectures.preview AS lecture_preview,lectures.video AS lecture_video
    FROM courses
    INNER JOIN subgenres ON subgenres._id = courses.subgenre
    INNER JOIN genres ON subgenres.genre = genres._id
    INNER JOIN users ON users._id = courses.lecturer
    INNER JOIN lectures ON lectures.course_id = courses._id
    WHERE courses._id = ?`
    const params = [courseid]

    const [result] = await pool.query(sql, params);

    if (!result.length) {
        res.send({});
        return;
    }
    res.send({
        code: 200,
        mesenge: "Thanh cong",
        course: {
            ...result[0],
            lectures: result.map(item => {
                const { lecture_preview, lecture_id, lecture_name, lecture_video } = item;
                return {
                    _id: lecture_id,
                    preview: lecture_preview,
                    name: lecture_name,
                    video: lecture_video,
                }
            }),
            genre: {
                _id: result[0].genre_id,
                name: result[0].genre_name,
            },
            subgenre: {
                _id: result[0].subgenre_id,
                name: result[0].subgenre_name,
            },
            lecturer: {
                _id: result[0].lecturer_id,
                username: result[0].lecture_username,
                photo: result[0].lecture_photo,
                biography: result[0].lecture_biography,
                linkedin: result[0].lecturer_linkedin,
                twitter: result[0].lecturer_twitter,
                website: result[0].lecturer_website,
                youtube: result[0].lecturer_youtube,
            },
            needtoknow: JSON.parse(result[0].needtoknow || "[]"),
            targetstudent: JSON.parse(result[0].targetstudent || "[]"),
            willableto: JSON.parse(result[0].willableto || "[]"),
        },
    });

}

const getCoursesSearch = async (req, res, next) => {
    const level = Number(req.query.level)
    const free = req.query.free === "true";
    const sort = Number(req.query.sort) || COURSE_SORT.POPULAR
    const page = Number(req.query.page) || 1
    const name = req.query.name;

    let sql = `SELECT *, users.photo AS user_photo, users.username AS user_username
    FROM courses    
    INNER JOIN users ON users._id = courses.lecturer`

    const cond = [];
    const params = []
    if (level) {
        cond.push("courses.level = ?")
        params.push(level);
    }
    if (free) {
        cond.push("courses.cost = 0")
    } else {
        cond.push("courses.cost > 0")
    }
    if (name) {
        cond.push("courses.name LIKE ?")
        params.push(`%${name}%`)
    }

    if (cond.length > 0) {
        sql = sql + " WHERE " + cond.join(" AND ");
    }

    if (sort === COURSE_SORT.POPULAR) {
        sql = sql + " ORDER BY courses.numberofstudent DESC"
    } else if (sort === COURSE_SORT.HIGH_RATE) {
        sql = sql + " ORDER BY courses.star DESC"
    } else if (sort === COURSE_SORT.NEW) {
        sql = sql + " ORDER BY courses.createdAt DESC"
    } else if (sort === COURSE_SORT.PRICE_LOW) {
        sql = sql + " ORDER BY courses.cost ASC"
    } else if (sort === COURSE_SORT.PRICE_HIGH) {
        sql = sql + " ORDER BY courses.cost DESC"
    }

    sql = sql + " LIMIT 8 OFFSET ?"
    params.push((page - 1) * 8);

    const [courses] = await pool.query(sql, params);

    res.send({
        code: 200,
        courses: courses.map(course => {
            course.lecturer = { photo: course.user_photo, username: course.user_username };
            return course;
        }),
    });
    return;

}

module.exports = {
    genreAll,
    getCoursesHomePage,
    getCoursesGenre,
    getCoursesSubgenre,
    getCoursesRelate,
    getCourseInfo,

    getCoursesSearch,

}
