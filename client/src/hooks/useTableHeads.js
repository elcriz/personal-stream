import { useState } from 'react';

const useTableHeads = (defaultSortBy, defaultIsAscending = false) => {
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [isAscending, setIsAscending] = useState(defaultIsAscending);

  const handleTableHeadClick = (newSortBy) => {
    setSortBy(newSortBy);
    if (sortBy === newSortBy) {
      setIsAscending((current) => !current);
    }
  };

  return {
    handleTableHeadClick,
    sortBy,
    isAscending,
  };
};

export default useTableHeads;
