import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TableHeadButton = ({
  children,
  label,
  activeLabel,
  onClick,
  isAscending,
}) => {
  const isSelected = label === activeLabel;

  return (
    <button
      className={classnames('table-head-button', {
        'table-head-button--selected': isSelected,
        'table-head-button--orientation-upwards': isSelected && isAscending,
        'table-head-button--orientation-downwards': isSelected && !isAscending,
      })}
      type="button"
      onClick={() => {
        onClick(label);
      }}
    >
      {children}
    </button>
  );
};

TableHeadButton.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  activeLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isAscending: PropTypes.bool.isRequired,
};

export default TableHeadButton;
