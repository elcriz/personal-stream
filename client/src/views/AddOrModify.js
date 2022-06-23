import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import streamService from '../services/streamService';
import Canvas from '../components/Canvas';
import Field from '../components/Field';
import ItemsList from '../components/ItemsList';
import Item from '../models/Item.js';
import useAuth from '../hooks/useAuth';

const AddOrModify = () => {
  const [tags, setTags] = useState([]);
  const [item, setItem] = useState(new Item());
  const [error, setError] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const auth = useAuth();

  const handleChange = (newValue, property) => {
    setItem(previous => new Item({
      ...previous,
      [property]: newValue,
    }));
  };

  const fetchTags = () => {
    setIsFetching(true);

    streamService.retrieveAllTags()
      .then((data) => {
        setIsFetching(false);
        setTags(data);
      })
      .catch((error) => {
        setIsFetching(false);
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      setIsSubmitting(true);

      streamService.createItem(item, auth.user.token)
        .then(() => {
          setIsSubmitting(false);
          setIsAdded(true);
        })
        .catch((error) => {
          console.log(error);
          setIsSubmitting(false);
          setError('Adding new item failed');
        });
    }
  };

  useEffect(() => {
    setIsValid(item.isValid()
      && auth.user.isAllowedToAdd
      && auth.user.isAllowedToModify
    );
  }, [item]);

  useEffect(() => {
    fetchTags();
  }, []);

  if (isAdded) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <Canvas isWide>
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <h2 className="form__heading">Add new item</h2>
        <Field
          id="title"
          className="form__field"
          type="text"
          label="Title"
          value={item.title}
          placeholder="Item title"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <Field
          id="body"
          className="form__field"
          type="body"
          label="Body (markdown allowed)"
          value={item.body}
          placeholder="Item body"
          disabled={isSubmitting}
          onChange={handleChange}
        >
          <div className="form__preview">
            <ReactMarkdown>
              {item.body || 'Preview comes here...'}
            </ReactMarkdown>
          </div>
        </Field>
        {!isFetching && (
          <ItemsList
            id="tags"
            label="Tags"
            singleItemLabel="tag"
            options={tags}
            onChange={handleChange}
          />
        )}
        <ItemsList
          id="images"
          label="Images"
          singleItemLabel="image"
          options={[]}
          onChange={handleChange}
        />
        <ItemsList
          id="videos"
          label="Videos"
          singleItemLabel="video"
          options={[]}
          onChange={handleChange}
        />
        <button
          className="button"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Add item
        </button>
        {error && (
          <div className="form__error error">
            {error}
          </div>
        )}
      </form>
    </Canvas>
  );
};

export default AddOrModify;
