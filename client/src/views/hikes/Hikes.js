import React, { useState, useEffect } from 'react';
import hikesService from '../../services/hikes/hikesService';
import useAuth from '../../hooks/useAuth';
import useTableHeads from '../../hooks/useTableHeads';
import Hike from '../../models/hikes/Hike';
import Canvas from '../../components/Canvas';
import SkeletonItem from '../../components/SkeletonItem';
import TableHeadButton from '../../components/TableHeadButton';
import AddHikeModal from '../../components/hikes/AddHikeModal';

const Hikes = () => {
  const [hikes, setHikes] = useState([]);
  const [totals, setTotals] = useState({});
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHikeToAddVisible, setIsHikeToAddVisible] = useState(false);

  const { handleTableHeadClick, sortBy, isAscending } = useTableHeads('dateTime');

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
    setIsFetching(true);
    setError('');
    hikesService
      .retrieveHikes(auth.user.token, sortBy, isAscending)
      .then(({
        amount: newAmount,
        totals: newTotals,
        hikes: newHikes,
      }) => {
        setAmount(newAmount);
        setTotals(newTotals);
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

  useEffect(() => {
    fetchHikes();
  }, [sortBy, isAscending]);

  return (
    <Canvas size="full">
      <div className="log">
        <header className="log__header">
          <h1 className="log__heading">
            <em>{amount === 1 ? '1 Hike' : `${amount} Hikes`} so far</em> ({totals.distance ? totals.distance.toFixed(2) : 0} km)
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
            {isFetching && hikes.length === 0 && (
              <SkeletonItem />
            )}
            {hikes.length > 0 && (
              <table
                className="log__table"
                data-variant={isFetching ? 'loading' : 'loaded'}
              >
                <thead>
                  <tr>
                    <th rowSpan="2">
                      <TableHeadButton
                        label="dateTime"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Date &amp; time
                      </TableHeadButton>
                    </th>
                    <th rowSpan="2">
                      <TableHeadButton
                        label="location"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Location
                      </TableHeadButton>
                    </th>
                    <th rowSpan="2">
                      <TableHeadButton
                        label="distance"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Distance
                      </TableHeadButton>
                    </th>
                    <th rowSpan="2">
                      <TableHeadButton
                        label="elevationGain"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Elevation gain
                      </TableHeadButton>
                    </th>
                    <th colSpan="2">Duration <span>(hh:mm)</span></th>
                    <th colSpan="2">Speed</th>
                  </tr>
                  <tr>
                    <th>
                      <TableHeadButton
                        label="durationMoving"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Moving
                      </TableHeadButton>
                    </th>
                    <th>
                      <TableHeadButton
                        label="durationStopped"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Stopped
                      </TableHeadButton>
                    </th>
                    <th>
                      <TableHeadButton
                        label="speedMoving"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Moving
                      </TableHeadButton>
                    </th>
                    <th>
                      <TableHeadButton
                        label="speedOverall"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Overall
                      </TableHeadButton>
                    </th>
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
