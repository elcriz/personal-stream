import { useEffect, useState, SyntheticEvent, ChangeEvent } from 'react';

interface ItemsListProps {
  id: string;
  label?: string;
  singleItemLabel?: string;
  options?: string[];
  defaultValues: string[];
  onChange: (values: string[], id: string) => void;
  disabled: boolean;
}

const ItemsList = ({
  id,
  label,
  singleItemLabel,
  options,
  defaultValues,
  onChange,
  ...rest
}: ItemsListProps) => {
  const [values, setValues] = useState(defaultValues);
  const availableOptions = (options || []).filter((option) => values.indexOf(option) === -1);

  const handleUseOption = (event: SyntheticEvent, optionToAdd: string) => {
    event.preventDefault();
    setValues((previous) => [
      ...previous.filter((value) => value !== '' && value !== optionToAdd),
      optionToAdd,
    ]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>, indexToChange: number) => {
    setValues((previous) =>
      previous.map((value, valueIndex) =>
        valueIndex === indexToChange ? event.target.value : value,
      ),
    );
  };

  const handleDelete = (event: SyntheticEvent, indexToDelete: number) => {
    event.preventDefault();
    setValues((previous) => previous.filter((_, valueIndex) => valueIndex !== indexToDelete));
  };

  const handleAdd = (event: SyntheticEvent) => {
    event.preventDefault();
    setValues((previous) => [...previous, '']);
  };

  useEffect(() => {
    onChange(
      values.map((value) => value.trim()).filter((value) => value !== ''),
      id,
    );
  }, [values]);

  return (
    <div
      id={id}
      className="field"
    >
      {label && <label>{label}</label>}
      <div className="items-list">
        {availableOptions.length > 0 && (
          <div className="items-list__options">
            <h3>Existing</h3>
            {availableOptions.map((option, optionIndex) => (
              <button
                key={optionIndex}
                className="items-list__option link"
                type="button"
                onClick={(event) => {
                  handleUseOption(event, option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {values.map((value, valueIndex) => (
          <div
            key={valueIndex}
            className="items-list__value-field"
          >
            <input
              {...rest}
              className="items-list__input input input--text"
              type="text"
              value={value}
              onChange={(event) => {
                handleChange(event, valueIndex);
              }}
            />
            {values.length > 1 && (
              <div className="items-list__item-actions">
                <button
                  {...rest}
                  className="items-list__button items-list__button--remove button button--secondary"
                  type="button"
                  onClick={(event) => {
                    handleDelete(event, valueIndex);
                  }}
                  title={`Remove ${singleItemLabel}`}
                />
              </div>
            )}
          </div>
        ))}
        <button
          className="items-list__button items-list__button--add button button--secondary"
          type="button"
          onClick={handleAdd}
        >
          Add another {singleItemLabel}
        </button>
      </div>
    </div>
  );
};

export default ItemsList;
