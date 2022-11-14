import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Canvas = ({
  children,
  size,
}) => (
  <div className={classnames('canvas', {
    'canvas--wide': size === 'wide',
    'canvas--full': size === 'full',
  })}>
    {children}
  </div>
);

Canvas.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['wide', 'full']),
};

export default Canvas;
