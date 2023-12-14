const express = require('express');
const { getHikes, addHike } = require('../../controllers/hikes/hikeController');
const { verifyUser } = require('../../utils/authenticate');
const router = express.Router();

router.get('/', verifyUser, getHikes);

router.post('/', verifyUser, addHike);

module.exports = router;
