import { getRelativeDate, getReadableDate, getHoursFromMinutes } from '../../helpers/dateTimeHelper';
import Hike from '../../models/hikes/Hike';

function serializeHike({
  createdAt,
  updatedAt,
  duration,
  speed,
  ...hike
}) {
  return {
    _id: hike._id,
    ...new Hike({
      durationMoving: duration.moving,
      durationStopped: duration.stopped,
      speedMoving: speed.moving,
      speedOverall: speed.overall,
      ...hike,
    }),
    dates: {
      hiked: getReadableDate(hike.dateTime),
      created: getReadableDate(createdAt),
      updated: getReadableDate(updatedAt),
    },
    relativeDates: {
      hiked: getRelativeDate(hike.dateTime),
      created: getRelativeDate(createdAt),
      updated: getRelativeDate(updatedAt),
    },
    hours: {
      moved: getHoursFromMinutes(duration.moving),
      stopped: getHoursFromMinutes(duration.stopped),
    }
  };
}

export default {
  /**
   * Retrieve hikes.
   * @param {string} _token
   * @param {string} sortBy - Value to sort results by
   * @param {boolean} isAscending - Should results be ordered ascending?
   * @returns Promise
   */
  retrieveHikes: async (_token, sortBy, isAscending = false) => {
    try {
      const response = await fetch(
        `/api/hikes?sortBy=${sortBy}&order=${isAscending ? 'asc' : 'desc'}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const { amount, hikes } = await response.json();
      return { amount, hikes: hikes.map(serializeHike) };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new hike.
   * @param {Object<Item>} body
   * @param {string} _token
   * @returns Promise
   */
  createHike: async (body, _token) => {
    try {
      const response = await fetch(
        '/api/hikes',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const hike = await response.json();
      return serializeHike(hike);
    } catch (error) {
      throw error;
    }
  }
};
