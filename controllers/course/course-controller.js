const express = require('express');
const { errorHandle } = require('../../common/errorhanle');
const { getCoursesHomePage, getCoursesGenre, getCoursesSubgenre, getCoursesSearch, getCoursesRelate, genreAll, getCourseInfo, getReview } = require('./course-service');
const router = express.Router();

router.get('/genreAll', errorHandle(genreAll));
router.get('/getCoursesHomePage', errorHandle(getCoursesHomePage));
router.get('/getCoursesGenre/:genreid', errorHandle(getCoursesGenre));
router.get('/getCoursesSubgenre/:subgenreid', errorHandle(getCoursesSubgenre));
router.get('/getCoursesRelate', errorHandle(getCoursesRelate));
router.get('/getCourseInfo', errorHandle(getCourseInfo));
router.get('/getReview', errorHandle(getReview));


router.get('/getCoursesSearch', errorHandle(getCoursesSearch));

module.exports = router

