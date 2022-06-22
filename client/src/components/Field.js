import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Field = ({
  id,
  className,
  label,
  type,
  value,
  onChange,
  children,
  ...rest
}) => (
  <div
    className={classnames(className, 'field')}
  >
    <label htmlFor={id}>{label}</label>
    <div className="field__inner">
      {type !== 'body' && (
        <input
          {...rest}
          id={id}
          className={`input input--${type}`}
          type={type}
          value={value}
          onChange={(event) => {
            onChange(event.target.value, event.target.id);
          }}
        />
      )}
      {type === 'body' && (
        <textarea
          {...rest}
          id={id}
          className={`input input--${type}`}
          value={value}
          onChange={(event) => {
            onChange(event.target.value, event.target.id);
          }}
        />
      )}
      {children && (
        <aside>
          {children}
        </aside>
      )}
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
  onChange: PropTypes.func,
  children: PropTypes.node,
};

export default Field;
