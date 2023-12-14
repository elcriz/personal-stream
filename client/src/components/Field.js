import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Field = ({ id, className, label, type, options, value, onChange, children, ...rest }) => (
  <div className={classnames(className, 'field')}>
    <label htmlFor={id}>{label}</label>
    <div className="field__inner">
      {type !== 'body' && type !== 'radio' && (
        <input
          {...rest}
          id={id}
          className={`input input--${type}`}
          type={type}
          value={value}
          onChange={({ target }) => {
            onChange(target.value, target.id);
          }}
        />
      )}
      {type === 'body' && (
        <textarea
          {...rest}
          id={id}
          className="input input--body"
          value={value}
          onChange={({ target }) => {
            onChange(target.value, target.id);
          }}
        />
      )}
      {type === 'radio' &&
        options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="field__radio-item"
          >
            <input
              {...rest}
              type="radio"
              name={id}
              id={option}
              value={option}
              checked={value === option.toLowerCase()}
              onChange={() => {
                onChange(option, id);
              }}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      {children && <aside>{children}</aside>}
    </div>
  </div>
);

Field.defaultProps = {
  type: 'text',
};

Field.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

export default Field;
