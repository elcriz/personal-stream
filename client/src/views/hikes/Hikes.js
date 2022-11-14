import React, { useState, useEffect } from 'react';
import hikesService from '../../services/hikes/hikesService';
import useAuth from '../../hooks/useAuth';
import { getHoursFromMinutes } from '../../helpers/dateTimeHelper';
import { getTotal, getAverage } from '../../helpers/calculationHelper';
import Hike from '../../models/hikes/Hike';
import Canvas from '../../components/Canvas';
import SkeletonItem from '../../components/SkeletonItem';
import AddHikeModal from '../../components/hikes/AddHikeModal';

const defaultAmount = 0;
const defaultTotals = {
  distance: 0,
  elevationGain: 0,
  durationMoving: 0,
  durationStopped: 0,
  speedMoving: 0,
  speedOverall: 0,
};

const Hikes = () => {
  const [hikes, setHikes] = useState([]);
  const [totals, setTotals] = useState(defaultTotals);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(defaultAmount);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHikeToAddVisible, setIsHikeToAddVisible] = useState(false);

  const auth = useAuth();

  const handleAddSubmit = (hikeToAdd = new Hike(), callback, event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    hikesService
      .createHike(hikeToAdd, auth.user.token)
      .then((hikeAdded) => {
        setHikes(currentHikes => ([
          hikeAdded,
          ...currentHikes,
        ]));
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsFetching(true);
        fetchHikes();
        callback();
      });
  };

  const fetchHikes = () => {
    setError('');
    hikesService
      .retrieveHikes(auth.user.token)
      .then(({ amount: newAmount, hikes: newHikes }) => {
        setAmount(newAmount);
        setHikes(previous => ([
          ...previous.filter(existing =>
            newHikes.findIndex(hike => hike._id === existing._id) === -1,
          ),
          ...newHikes,
        ]));
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const calculateTotals = () => {
    if (hikes.length === 0) {
      setTotals(defaultTotals);
      return;
    }

    setTotals({
      distance: getTotal(hikes, 'distance'),
      elevationGain: getTotal(hikes, 'elevationGain'),
      durationMoving: getHoursFromMinutes(getTotal(hikes, 'durationMoving')),
      durationStopped: getHoursFromMinutes(getTotal(hikes, 'durationStopped')),
      speedMoving: getAverage(hikes, 'speedMoving'),
      speedOverall: getAverage(hikes, 'speedOverall'),
    });
  };

  useEffect(() => {
    fetchHikes();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [hikes]);

  return (
    <Canvas size="full">
      <div className="log">
        <header className="log__header">
          <h1 className="log__heading">
            <em>{amount === 1 ? '1 Hike' : `${amount} Hikes`} so far</em> ({totals.distance.toFixed(2)} km)
          </h1>
        </header>

        <button
          className="log__button button"
          type="button"
          disabled={isHikeToAddVisible}
          onClick={() => {
            setIsHikeToAddVisible(true);
          }}
        >
          Add hike
        </button>

        <div className="log__overview-wrapper">
          <div className="log__overview">
            {isFetching && (
              <SkeletonItem />
            )}
            {!isFetching && hikes.length > 0 && (
              <table className="log__table">
                <thead>
                  <tr>
                    <th rowSpan="2">Date &amp; time</th>
                    <th rowSpan="2">Location</th>
                    <th rowSpan="2" data-alignment="end">Distance</th>
                    <th rowSpan="2" data-alignment="end">Elevation gain</th>
                    <th colSpan="2">Duration <span>(hh:mm)</span></th>
                    <th colSpan="2">Speed</th>
                  </tr>
                  <tr>
                    <th data-alignment="end">Moving</th>
                    <th data-alignment="end">Stopped</th>
                    <th data-alignment="end">Moving</th>
                    <th data-alignment="end">Overall</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <td colSpan="2" />
                    <td colSpan="4">Totals</td>
                    <td colSpan="2">Averages</td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      data-alignment="end"
                    >
                      {totals.distance.toFixed(2)} <span>km</span>
                    </td>
                    <td data-alignment="end">{totals.elevationGain} <span>m</span></td>
                    <td data-alignment="end">{totals.durationMoving}</td>
                    <td data-alignment="end">{totals.durationStopped}</td>
                    <td data-alignment="end">{totals.speedMoving.toFixed(2)} <span>km/h</span></td>
                    <td data-alignment="end">{totals.speedOverall.toFixed(2)} <span>km/h</span></td>
                  </tr>
                </tfoot>
                <tbody>
                  {hikes.map(({ _id, dates, relativeDates, ...hike }, hikeIndex) => (
                    <tr
                      key={_id}
                      data-index={hikeIndex % 2 === 0 ? 'even' : 'odd'}
                    >
                      <td>
                        <em>{relativeDates.hiked}</em>
                        <span>{dates.hiked}</span>
                      </td>
                      <td>{hike.location}</td>
                      <td data-alignment="end">{hike.distance.toFixed(2)} <span>km</span></td>
                      {hike.elevationGain === 0 && (
                        <td data-alignment="end">-</td>
                      )}
                      {hike.elevationGain > 0 && (
                        <td data-alignment="end">{hike.elevationGain} <span>m</span></td>
                      )}
                      <td data-alignment="end">{hike.hours.moved}</td>
                      <td data-alignment="end">{hike.hours.stopped}</td>
                      <td data-alignment="end">{hike.speedMoving.toFixed(2)} <span>km/h</span></td>
                      <td data-alignment="end">{hike.speedOverall.toFixed(2)} <span>km/h</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AddHikeModal
        onSubmit={handleAddSubmit}
        onCancel={() => {
          setIsHikeToAddVisible(false);
        }}
        isVisible={isHikeToAddVisible}
        isSubmitting={isSubmitting}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </Canvas>
  );
};

export default Hikes;
