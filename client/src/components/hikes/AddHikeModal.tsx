import classnames from 'classnames';
import { useEffect, useState, SyntheticEvent, FormEvent } from 'react';
import useAuth from 'src/hooks/useAuth';
import Hike, { HikeModel } from 'src/models/hikes/Hike';
import Field from 'src/components/Field';

const defaultDate = new Date().toJSON().slice(0, 10);
const defaultTime = '00:00';

interface AddHikeModalProps {
  onSubmit: (
    hikeToAdd: HikeModel,
    handleCancel: () => void,
    event: FormEvent<HTMLFormElement>,
  ) => void;
  onCancel: () => void;
  isVisible: boolean;
  isSubmitting: boolean;
}

function AddHikeModal({ onSubmit, onCancel, isVisible, isSubmitting }: AddHikeModalProps) {
  const [hikeToAdd, setHikeToAdd] = useState<HikeModel>(new Hike());
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [isValid, setIsValid] = useState(false);

  const auth = useAuth();

  const handleChange = (newValue: string, property?: string) => {
    if (property) {
      if (['date', 'time'].indexOf(property) !== -1) {
        handleChange(
          `${property === 'date' ? newValue : date}T${
            property === 'time' ? newValue : time
          }:00+01:00`,
          'dateTime',
        );
        setDate(property === 'date' ? newValue : date);
        setTime(property === 'time' ? newValue : time);
        return;
      }

      setHikeToAdd(
        (previous) =>
          new Hike({
            ...previous,
            [property]: newValue,
          }),
      );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid) {
      onSubmit(hikeToAdd, handleCancel, event);
    }
  };

  const handleCancel = (event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setHikeToAdd(new Hike());
    setDate(defaultDate);
    setTime(defaultTime);
    onCancel();
  };

  useEffect(() => {
    setIsValid(hikeToAdd.isValid() && auth.user.isAllowedToAdd && auth.user.isAllowedToModify);
  }, [hikeToAdd, date, time]);

  return (
    <div
      className={classnames('modal', {
        'is-hidden': !isVisible,
        'is-loading': isSubmitting,
      })}
    >
      <div className="modal__inner">
        <h2 className="modal__heading">Add new hike</h2>
        <button
          className="modal__button button button--secondary"
          type="button"
          title="Sluiten"
          onClick={handleCancel}
        >
          x
        </button>
        <div className="modal__content">
          <form
            className="modal__form form"
            onSubmit={handleSubmit}
          >
            <div className="form__group">
              <Field
                id="date"
                className="form__field"
                type="date"
                label="Date"
                value={date}
                placeholder="eg. 1970-01-01"
                disabled={isSubmitting}
                onChange={handleChange}
              />
              <Field
                id="time"
                className="form__field"
                type="time"
                label="Time"
                value={time}
                placeholder="eg. 15:00"
                disabled={isSubmitting}
                onChange={handleChange}
              />
            </div>
            <Field
              id="location"
              className="form__field"
              type="text"
              label="Location"
              value={hikeToAdd.location}
              placeholder="eg. Sleenerzand"
              disabled={isSubmitting}
              onChange={handleChange}
            />
            <div className="form__group">
              <Field
                id="distance"
                className="form__field"
                type="text"
                label="Distance (km)"
                defaultValue={hikeToAdd.distance}
                placeholder="0"
                disabled={isSubmitting}
                onChange={handleChange}
              />
              <Field
                id="elevationGain"
                className="form__field"
                type="text"
                label="Elevation gain (m)"
                defaultValue={hikeToAdd.elevationGain}
                placeholder="0"
                disabled={isSubmitting}
                onChange={handleChange}
              />
            </div>
            <div className="form__group">
              <Field
                id="durationMoving"
                className="form__field"
                type="text"
                label="Moving time (minutes)"
                defaultValue={hikeToAdd.durationMoving}
                placeholder="0"
                disabled={isSubmitting}
                onChange={handleChange}
              />
              <Field
                id="durationStopped"
                className="form__field"
                type="text"
                label="Time stopped (minutes)"
                defaultValue={hikeToAdd.durationStopped}
                placeholder="0"
                disabled={isSubmitting}
                onChange={handleChange}
              />
            </div>
            <div className="form__group">
              <Field
                id="speedMoving"
                className="form__field"
                type="text"
                label="Speed moving (km/h)"
                defaultValue={hikeToAdd.speedMoving}
                placeholder="0"
                disabled={isSubmitting}
                onChange={handleChange}
              />
              <Field
                id="speedOverall"
                className="form__field"
                type="text"
                label="Speed average (km/h)"
                defaultValue={hikeToAdd.speedOverall}
                placeholder="0"
                disabled={isSubmitting}
                onChange={handleChange}
              />
            </div>
            <div className="form__buttons">
              <button
                className="button"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Add hike
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddHikeModal;
