const express = require('express');
const { authMiddleware } = require('../../middlewares/auth-middleware');
const { getUserInfo } = require('./profile-service');
const router = express.Router();


router.use(authMiddleware);
router.get('/getInfo', getUserInfo);

module.exports = router
