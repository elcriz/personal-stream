import classnames from 'classnames';
import { useEffect, useState } from 'react';

interface SegmentedControlProps {
  id?: string;
  className?: string;
  label?: string;
  options: string[] | object[];
  value?: string[] | string;
  onChange: (value: string[] | string) => void;
  isSmall?: boolean;
  isInline?: boolean;
}

function SegmentedControl({
  id,
  className,
  label,
  options,
  value,
  onChange,
  isSmall = false,
  isInline = false,
  ...rest
}: SegmentedControlProps) {
  const isMultiSelect = value && Array.isArray(value);
  const [currentValue, setValue] = useState<string[] | string>(value || (isMultiSelect ? [] : ''));

  const handleChange = (newValue: string[] | string, isChecked: boolean) => {
    if (!isMultiSelect) {
      setValue(newValue);
      return;
    }

    if (!Array.isArray(newValue)) {
      setValue((oldValues) => {
        if (!Array.isArray(oldValues)) {
          return newValue;
        }
        const valueToReturn = [
          ...oldValues.filter((foundValue) => foundValue !== newValue),
          newValue,
        ].filter((foundValue) => (isChecked ? foundValue !== newValue : true));
        return valueToReturn;
      });
    }
  };

  useEffect(() => {
    if (onChange && currentValue !== value) {
      onChange(currentValue);
    }
  }, [currentValue]);

  useEffect(() => {
    if (value) {
      setValue(value || (isMultiSelect ? [] : ''));
    }
  }, [value]);

  return (
    <div
      {...rest}
      className={classnames(className, 'segmented-control', {
        'segmented-control--inline': isInline,
        'segmented-control--small': isSmall,
      })}
    >
      {label && (
        <div className="segmented-control__label-box">
          <label className="segmented-control__label">{label}</label>
        </div>
      )}
      <div className="segmented-control__items">
        {options.map((optionValue, index) => {
          const optionId = `${id}-${index}`;
          const serializedOptionValue =
            typeof optionValue === 'object' ? Object.keys(optionValue)[0] : optionValue;
          const inputLabel =
            typeof optionValue === 'object'
              ? optionValue[Object.keys(optionValue) as keyof typeof optionValue]
              : optionValue;
          const checked = isMultiSelect
            ? currentValue.indexOf(serializedOptionValue) !== -1
            : currentValue === serializedOptionValue;

          return (
            <label
              key={index}
              className={`segmented-control__item${
                value === serializedOptionValue ? ' is-selected' : ''
              }`}
              htmlFor={optionId}
            >
              <input
                id={optionId}
                className="segmented-control__input"
                name={id}
                value={serializedOptionValue}
                checked={checked}
                type={isMultiSelect ? 'checkbox' : 'radio'}
                onChange={(event) => {
                  handleChange(event.target.value, checked);
                }}
              />
              <span className="segmented-control__input-label">{inputLabel}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default SegmentedControl;
