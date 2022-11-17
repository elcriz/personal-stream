const { format, formatDistance } = require('date-fns');

module.exports = {
  /**
   * Get a relative date for a given timestamp.
   * @param {string} timestamp
   * @returns {string}
   */
  getRelativeDate: (timestamp) => {
    const relativeDate = formatDistance(
      new Date(timestamp),
      new Date(),
      { addSuffix: true },
    );
    return relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);
  },

  /**
   * Get a human readable date format for a given timestamp.
   * @param {string} timestamp
   * @param {string} dateTimeFormat
   * @returns {string}
   */
  getReadableDate: (timestamp, dateTimeFormat = 'dd-MM-yyyy HH:mm') => format(
    new Date(timestamp),
    dateTimeFormat,
  ),

  /**
   * Get hours and minutes for a given number of total minutes.
   * @param {number} totalMinutes
   * @returns {string}
   */
  getHoursFromMinutes: (totalMinutes) => {
    const getWithZeroes = calculated => (
      calculated < 10 ? `0${calculated}` : calculated 
    );
    const hours = getWithZeroes(Math.floor(totalMinutes / 60));
    const minutes = getWithZeroes(totalMinutes % 60);
    return `${hours}:${minutes}`;
  },

  /**
   * Get a mongoose where query to filter by date range (either year and/or month).
   * @param {(number|string)} year
   * @param {(number|string)} month 
   * @returns {object}
   */
  getDateTimeFilter: (year, month) => {
    if (!year) {
      return {};
    }
    return {
      $gte: new Date(year, (month ? (month - 1) : 0), 1),
      $lt: new Date(year, month || 12, 1),
    };
  },
};
