import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import streamService from '../services/streamService';
import Canvas from '../components/Canvas';
import SingleItem from '../components/Item';
import SkeletonItem from '../components/SkeletonItem';

const defaultErrorMessage = 'An error occured whilst fetching the item, please try again later';

const Item = () => {
  const [item, setItem] = useState(undefined);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { slug } = useParams();

  const fetchItem = () => {
    setError('');
    setIsFetching(true);
    streamService.retrieveItemBySlug(slug)
      .then((retrievedItem) => {
        setIsFetching(false);
        setItem(retrievedItem);
      })
      .catch(() => {
        setError(defaultErrorMessage);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchItem();
  }, []);

  if (!slug) {
    return (
      <Navigate to="/" />
    );
  }

  if (isFetching) {
    return (
      <Canvas isWide>
        <SkeletonItem />
      </Canvas>
    );
  }

  return (
    <Canvas isWide>
      {item && (
        <SingleItem
          className="item--single stream__item"
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
