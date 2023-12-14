import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Canvas from 'src/components/Canvas';
import SingleItem from 'src/components/Item';
import SkeletonItem from 'src/components/SkeletonItem';
import streamService, { ISerializedItem } from 'src/services/streamService';

const defaultErrorMessage = 'An error occured whilst fetching the item, please try again later';

function Item() {
  const [item, setItem] = useState<ISerializedItem | undefined>(undefined);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { slug } = useParams();

  const fetchItem = () => {
    if (slug) {
      setError('');
      setIsFetching(true);
      streamService
        .retrieveItemBySlug(slug)
        .then((retrievedItem) => {
          setIsFetching(false);
          setItem(retrievedItem);
        })
        .catch(() => {
          setError(defaultErrorMessage);
          setIsFetching(false);
        });
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  if (!slug) {
    return <Navigate to="/" />;
  }

  if (isFetching) {
    return (
      <Canvas size="wide">
        <SkeletonItem />
      </Canvas>
    );
  }

  return (
    <Canvas size="wide">
      {item && (
        <SingleItem
          className="item--single stream__item"
          item={item}
          isLoading={isFetching}
        />
      )}
      {error && <div className="error">{error}</div>}
    </Canvas>
  );
}

export default Item;
