module.exports = {
  getTotal: (array = [], parentKey, childKey) => array
    .reduce((amount, current) => (amount + (childKey
        ? current[parentKey][childKey]
        : current[parentKey]
    )), 0),

  getAverage: (array = [], parentKey, childKey) => array
    .map(item => (childKey
        ? item[parentKey][childKey]
        : item[parentKey]
    ))
    .reduce((a, b) => (a + b), 0) / array.length,
};
