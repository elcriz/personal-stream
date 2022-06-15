import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Canvas = ({
  children,
  isWide,
}) => (
  <div className={classnames('canvas', {
    'canvas--wide': isWide,
  })}>
    {children}
  </div>
);

Canvas.propTypes = {
  children: PropTypes.node.isRequired,
  isWide: PropTypes.bool,
};

export default Canvas;
