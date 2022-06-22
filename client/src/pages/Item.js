import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { formatDistance } from 'date-fns';
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

    fetch(`${process.env.REACT_APP_API_ENDPOINT}stream/item/${id}`)
      .then(async (response) => {
        setIsFetching(false);
        if (!response.ok) {
          setError(defaultErrorMessage);
          return Promise.resolve();
        }

        const item = await response.json();
        setItem({
          ...item,
            images: item.images.map(url =>
              `${process.env.REACT_APP_API_ENDPOINT}proxy?url=${url}`
            ),
            relativeDate: formatDistance(
              new Date(parseInt(item.time)),
              new Date(),
              { addSuffix: true },
            ),
        });
      })
      .catch(() => {
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
