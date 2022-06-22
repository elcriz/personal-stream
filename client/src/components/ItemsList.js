import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ItemsList = ({
  id,
  label,
  singleItemLabel,
  options,
  defaultValues,
  onChange,
}) => {
  const [values, setValues] = useState(['', ...defaultValues]);
  const availableOptions = options.filter(option => values.indexOf(option) === -1);

  const handleUseOption = (event, optionToAdd) => {
    event.preventDefault();
    setValues(previous => ([
      ...previous.filter(value => value !== '' && value !== optionToAdd),
      optionToAdd,
    ]));
  };

  const handleChange = (event, indexToChange) => {
    setValues(previous => previous.map((value, valueIndex) =>
      valueIndex === indexToChange ? event.target.value : value
    ));
  };

  const handleDelete = (event, indexToDelete) => {
    event.preventDefault();
    setValues(previous => previous.filter((_, valueIndex) =>
      valueIndex !== indexToDelete,
    ));
  };

  const handleAdd = (event) => {
    event.preventDefault();
    setValues(previous => ([...previous, '']));
  };

  useEffect(() => {
    onChange(
      values
        .map(value => value.trim())
        .filter(value => value !== ''),
      id
    );
  }, [values]);

  return (
    <div
      id={id}
      className="field"
    >
      {label && (
        <label>{label}</label>
      )}
      <div className="items-list">
        {availableOptions.length > 0 && (
          <div className="items-list__options">
            <h3>Existing {id}</h3>
            {availableOptions.map((option, optionIndex) => (
              <button
                key={optionIndex}
                className="items-list__option link"
                type="button"
                onClick={(event) => {
                  handleUseOption(event, option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {values.map((value, valueIndex) => (
          <div
            key={valueIndex}
            className="items-list__value-field"
          >
            <input
              className="items-list__input input input--text"
              type="text"
              value={value}
              onChange={(event) => {
                handleChange(event, valueIndex);
              }}
            />
            {values.length > 1 && (
              <div className="items-list__item-actions">
                <button
                  className="items-list__button items-list__button--remove button"
                  type="button"
                  onClick={(event) => {
                    handleDelete(event, valueIndex);
                  }}
                  title={`Remove ${singleItemLabel}`}
                />
              </div>
            )}
          </div>
        ))}
        <button
          className="items-list__button items-list__button--add button"
          type="button"
          onClick={handleAdd}
        >
          Add another {singleItemLabel}
        </button>
      </div>
    </div>
  );
};

ItemsList.defaultProps = {
  singleItemLabel: 'item',
  options: [],
  defaultValues: [],
};

ItemsList.propTypes = {
  label: PropTypes.string,
  singleItemLabel: PropTypes.string,
  options: PropTypes.array,
  defaultValues: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default ItemsList;
