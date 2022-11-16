const { format, formatDistance } = require('date-fns');

module.exports = {
  getRelativeDate: (timestamp) => {
    const relativeDate = formatDistance(
      new Date(timestamp),
      new Date(),
      { addSuffix: true },
    );
    return relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);
  },
  getReadableDate: (timestamp, dateTimeFormat = 'dd-MM-yyyy HH:mm') => format(
    new Date(timestamp),
    dateTimeFormat,
  ),
  getHoursFromMinutes: (totalMinutes) => {
    const getWithZeroes = calculated => (
      calculated < 10 ? `0${calculated}` : calculated 
    );
    const hours = getWithZeroes(Math.floor(totalMinutes / 60));
    const minutes = getWithZeroes(totalMinutes % 60);
    return `${hours}:${minutes}`;
  },
};
