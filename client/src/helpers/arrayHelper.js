export function getSortedByProperty(arrayToSort, propertyName, order = 'asc') {
  const sorted = arrayToSort.sort((a, b) => {
    if (a[propertyName] < b[propertyName]) {
      return -1;
    }
    if (a[propertyName] > b[propertyName]) {
      return 1;
    }
    return 0;
  });

  if (order === 'desc') {
    return sorted.reverse();
  }

  return sorted;
}
