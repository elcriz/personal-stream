const Player = require('../../models/whamhunter/playerModel');
const mongoose = require('mongoose');
const webPush = require('web-push');
const Subscriber = require('../../models/whamhunter/subscriberModel');

// Initialize push notifications
webPush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY,
);

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

    const score = scoringPlayer.score + 1;

    const player = await Player.findOneAndUpdate({ _id: id }, { score });

    if (!player) {
      return res.status(400).json({ error: 'No such item found' });
    }

    // Try to send push notifications to any subscribers
    const subscribers = await Subscriber.find({});
    if (subscribers.length > 0) {
      subscribers.forEach(({ subscription }) => {
        webPush
          .sendNotification(
            subscription,
            JSON.stringify({
              title: 'WHAM!',
              body: `Speler ${scoringPlayer.name} hoorde zojuist Last Christmas en heeft nu ${score} punten!`,
            }),
          )
          .catch((error) => {
            console.log('Server: error whilst attempting to send a push notification');
            console.error(error.stack, { subscription });
          });
      });
    }

    res.status(200).json(player);
  },
};
