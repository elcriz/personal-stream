import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Canvas = ({
  children,
  size,
  hasTopBorder,
}) => (
  <div className={classnames('canvas', {
    'canvas--wide': size === 'wide',
    'canvas--full': size === 'full',
    'canvas--with-top-border': hasTopBorder,
  })}>
    {children}
  </div>
);

Canvas.defaultProps = {
  hasTopBorder: false,
};

Canvas.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['wide', 'full']),
  hasTopBorder: PropTypes.bool,
};

export default Canvas;
