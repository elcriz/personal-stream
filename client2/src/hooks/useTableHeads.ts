import { useState } from 'react';

const useTableHeads = (defaultSortBy: string, defaultIsAscending = false) => {
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [isAscending, setIsAscending] = useState(defaultIsAscending);

  const handleTableHeadClick = (newSortBy: string) => {
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
