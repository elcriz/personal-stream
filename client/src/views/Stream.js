import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import streamService from '../services/streamService';
import Canvas from '../components/Canvas';
import Item from '../components/Item';
import Tags from '../components/Tags';

const defaultErrorMessage = 'An error occured whilst fetching new items, please try again later';
const defaultAmount = 0;
const defaultPage = 1;
const amountToFetch = 4;

const Stream = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState(defaultAmount);
  const [page, setPage] = useState(defaultPage);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const tag = searchParams.get('tag');

  const fetchItems = () => {
    setError('');
    setIsFetching(true);

    streamService.retrieveItems(page, amountToFetch, tag)
      .then(({ amount: newAmount, items: newItems }) => {
        setIsFetching(false);
        setAmount(newAmount);
        setItems(previous => ([
          ...previous.filter(existing =>
            newItems.findIndex(item => item._id === existing._id) === -1
          ),
          ...newItems
        ]));
      })
      .catch((error) => {
        setError(defaultErrorMessage);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  useEffect(() => {
    if (items.length > 0) {
      setItems([]);
      setAmount(defaultAmount);
      setPage(defaultPage);
      fetchItems();
    }
  }, [tag]);

  return (
    <Canvas>
      <div className="stream">
        <header className="stream__header" role="banner">
          <p>A personal collection of things I see, like, do, listen to and more.</p>
        </header>
        <Tags
          className="stream__tags"
          currentTag={tag}
        />
        {items.length > 0 && (
          <div className="stream__items">
            {items.map((item, itemIndex) => (
              <Item
                key={itemIndex}
                className="stream__item"
                item={item}
                shouldRenderOptions={false}
                isLoading={isFetching}
              />
            ))}
          </div>
        )}
        {(page * amountToFetch) < amount && (
          <div className="stream__paginator">
            <button
              className="button"
              type="button"
              disabled={isFetching}
              onClick={() => {
                setPage(current => (current + 1));
              }}
            >
              Load more items
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </Canvas>
  );
};

export default Stream;
