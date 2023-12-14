import classnames from 'classnames';
import { ReactNode } from 'react';

interface CanvasProps {
  children: ReactNode;
  size?: 'full' | 'wide';
  hasTopBorder?: boolean;
}

const Canvas = ({ children, size, hasTopBorder = false }: CanvasProps) => (
  <div
    className={classnames('canvas', {
      'canvas--wide': size === 'wide',
      'canvas--full': size === 'full',
      'canvas--with-top-border': hasTopBorder,
    })}
  >
    {children}
  </div>
);

export default Canvas;
