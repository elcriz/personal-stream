const Hike = require('../../models/hikes/hikesModel');

const mapSortByToSchema = {
  dateTime: 'dateTime',
  location: 'location',
  distance: 'distance',
  elevationGain: 'elevationGain',
  durationMoving: 'duration.moving',
  durationStopped: 'duration.stopped',
  speedMoving: 'speed.moving',
  speedOverall: 'speed.overall',
};

module.exports = {
  getHikes: async (req, res) => {
    const { sortBy = 'dateTime', order = 'desc' } = req.query;
    if (req.user.role !== 1) {
      return res.status(401).send();
    }
    if (!mapSortByToSchema[sortBy]) {
      return res.status(400).send();
    }
    if (['desc', 'asc'].indexOf(order) === -1) {
      return res.status(400).send();
    }
    const amount = await Hike.countDocuments();
    const hikes = await Hike
      .find()
      .sort({
        [mapSortByToSchema[sortBy]]: order === 'asc' ? 1 : -1,
      });
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
