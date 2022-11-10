export const getTotal = (array = [], key) => array
  .reduce((previous, current) => (
    previous + current[key]
  ), 0);

export const getAverage = (array = [], key) => array
  .map(item => item[key])
  .reduce((a, b) => a + b) / array.length;

export default {
  getTotal,
  getAverage,
};
