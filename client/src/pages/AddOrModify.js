import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Canvas from '../components/Canvas';
import Field from '../components/Field';
import Item from '../models/Item.js';

const AddOrModify = () => {
  const [item, setItem] = useState(new Item());
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (newValue, property) => {
    setItem(previous => new Item({
      ...previous,
      [property]: newValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setIsValid(item.isValid());
  }, [item]);

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
