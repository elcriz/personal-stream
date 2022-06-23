import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import streamService from '../services/streamService';
import Canvas from '../components/Canvas';
import SingleItem from '../components/Item';

const defaultErrorMessage = 'An error occured whilst fetching the item, please try again later';

const Item = () => {
  const [item, setItem] = useState(undefined);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { id } = useParams();

  const fetchItem = () => {
    setError('');
    setIsFetching(true);

    streamService.retrieveItemById(id)
      .then((retrievedItem) => {
        setIsFetching(false);
        setItem(retrievedItem);
      })
      .catch((error) => {
        setError(defaultErrorMessage);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchItem();
  }, []);

  if (!id) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <Canvas isWide>
      {item && (
        <SingleItem
          className="stream__item"
          item={item}
          isLoading={isFetching}
        />
      )}
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </Canvas>
  );
};

export default Item;
