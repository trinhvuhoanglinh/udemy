const express = require('express');
const { errorHandle } = require('../../common/errorhanle');
const { authMiddleware } = require('../../middlewares/auth-middleware');
const { createCourse, getMyCourses } = require('./mycourse-service');
const router = express.Router();

router.use(authMiddleware);
router.get('/getMyCourses', errorHandle(getMyCourses))
router.post('/createCourse', errorHandle(createCourse))



module.exports = router

