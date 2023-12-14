const Player = require('../../models/whamhunter/playerModel');
const mongoose = require('mongoose');

module.exports = {
  getPlayers: async (_, res) => {
    const items = await Player.find({});
    res.status(200).json({ items });
  },

  addPlayer: async (req, res) => {
    const { name } = req.body;
    try {
      const playerToAdd = await Player.create(new Player({ name, score: 0 }));
      res.status(201).json(playerToAdd);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  addScore: async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such player found' });
    }

    const scoringPlayer = await Player.findById(id);

    const player = await Player.findOneAndUpdate({ _id: id }, { score: scoringPlayer.score + 1 });

    if (!player) {
      return res.status(400).json({ error: 'No such item found' });
    }

    res.status(200).json(player);
  },
};
