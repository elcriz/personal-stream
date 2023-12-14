const express = require('express');

const {
  getPlayers,
  addPlayer,
  addScore,
} = require('../../controllers/whamhunter/playerController');

const router = express.Router();

router.get('/', getPlayers);

router.post('/player', addPlayer);

router.post('/score/:id', addScore);

module.exports = router;
