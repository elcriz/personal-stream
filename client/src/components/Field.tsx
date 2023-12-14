import classnames from 'classnames';
import { ReactNode } from 'react';

interface FieldProps {
  id: string;
  className?: string;
  label?: string;
  type?: string;
  options?: string[];
  value?: string | number;
  onChange: (newValue: string, property: string) => void;
  defaultValue?: string | number;
  placeholder?: string;
  children?: ReactNode;
  disabled: boolean;
}

const Field = ({
  id,
  className,
  label,
  type = 'text',
  options,
  value,
  onChange,
  children,
  ...rest
}: FieldProps) => (
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
        options?.map((option, optionIndex) => (
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

export default Field;
