const { getTotal, getAverage } = require('../../helpers/calculationHelper');
const { getHoursFromMinutes, getDateTimeFilter } = require('../../helpers/dateTimeHelper');
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
    const {
      sortBy = 'dateTime',
      order = 'desc',
      year = new Date().getFullYear(),
      month,
    } = req.query;

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
      .where({
        dateTime: getDateTimeFilter(year, month),
      })
      .sort({
        [mapSortByToSchema[sortBy]]: order === 'asc' ? 1 : -1,
      });
    try {
      const totals = {
        distance: Number(getTotal(hikes, 'distance').toFixed(2)),
        elevationGain: Number(getTotal(hikes, 'elevationGain').toFixed(2)),
        durationMoving: getHoursFromMinutes(getTotal(hikes, 'duration', 'moving')),
        durationStopped: getHoursFromMinutes(getTotal(hikes, 'duration', 'stopped')),
        speedMoving: Number(getAverage(hikes, 'speed', 'moving').toFixed(2)) || 0,
        speedOverall: Number(getAverage(hikes, 'speed', 'overall').toFixed(2)) || 0,
      };
      res.status(200).json({
        amount,
        filteredAmount: hikes.length,
        totals,
        hikes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
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
