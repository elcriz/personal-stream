import { format, formatDistance } from 'date-fns';

export const getRelativeDate = (timestamp) => {
  const relativeDate = formatDistance(
    new Date(timestamp),
    new Date(),
    { addSuffix: true },
  );
  return relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);
};

export const getReadableDate = (timestamp, dateTimeFormat = 'dd-MM-yyyy HH:mm') => format(
  new Date(timestamp),
  dateTimeFormat,
);

export const getReadableMonth = (month) => {
  const monthMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthMap[month];
};

export const getHoursFromMinutes = (totalMinutes) => {
  const getWithZeros = calculated => (
    calculated < 10 ? `0${calculated}` : calculated
  );
  const hours = getWithZeros(Math.floor(totalMinutes / 60));
  const minutes = getWithZeros(totalMinutes % 60);
  return `${hours}:${minutes}`;
};

export default {
  getRelativeDate,
  getReadableDate,
  getReadableMonth,
  getHoursFromMinutes,
};
