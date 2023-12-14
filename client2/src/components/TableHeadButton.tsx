import classnames from 'classnames';
import { ReactNode } from 'react';

interface TableHeadButtonProps {
  children: ReactNode;
  label: string;
  activeLabel: string;
  onClick: (label: string) => void;
  isAscending: boolean;
}

function TableHeadButton({
  children,
  label,
  activeLabel,
  onClick,
  isAscending,
}: TableHeadButtonProps) {
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
}

export default TableHeadButton;
