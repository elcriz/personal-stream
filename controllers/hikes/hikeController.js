const Hike = require('../../models/hikes/hikesModel');

module.exports = {
  getHikes: async (req, res) => {
    if (req.user.role !== 1) {
      return res.status(401).send();
    }
    const amount = await Hike.countDocuments();
    const hikes = await Hike
      .find()
      .sort('-dateTime');
    res.status(200).json({ amount, hikes });
  },

  addHike: async (req, res) => {
    if (req.user.role !== 1) {
      return res.status(401).send();
    }
    const {
      dateTime,
      location,
      distance,
      elevationGain,
      durationMoving,
      durationStopped,
      speedMoving,
      speedOverall,
    } = req.body;
    try {
      const hikeToAdd = await Hike
        .create(new Hike({
          dateTime,
          location,
          distance,
          elevationGain,
          duration: {
            moving: durationMoving,
            stopped: durationStopped,
          },
          speed: {
            moving: speedMoving,
            overall: speedOverall,
          }
        }));
        res.status(201).json(hikeToAdd);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
