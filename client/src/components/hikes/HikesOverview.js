import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useTableHeads from '../../hooks/useTableHeads';
import SkeletonItem from '../SkeletonItem';
import TableHeadButton from '../TableHeadButton';

const HikesOverview = ({
  hikes,
  amount,
  isAddingDisabled,
  isLoading,
  onFetch,
  onAddClick,
}) => {
  const { handleTableHeadClick, sortBy, isAscending } = useTableHeads('dateTime');

  useEffect(() => {
    onFetch(sortBy, isAscending);
  }, [sortBy, isAscending]);

  return (
    <section className="hikes-overview">
      <div className="hikes-overview__log log">
        <header className="log__header">
          <h1 className="log__heading">
            <em>{amount === 1 ? '1 Hike' : `${amount} Hikes`} so far</em>
          </h1>
        </header>

        <button
          className="log__button button"
          type="button"
          disabled={isAddingDisabled}
          onClick={onAddClick}
        >
          Add hike
        </button>

        <div className="log__overview-wrapper">
          <div className="log__overview">
            {isLoading && hikes.length === 0 && (
              <SkeletonItem />
            )}
            {hikes.length > 0 && (
              <table
                className="log__table"
                data-variant={isLoading ? 'loading' : 'loaded'}
              >
                <thead>
                  <tr>
                    <th
                      rowSpan="2"
                      data-variant="medium"
                    >
                      <TableHeadButton
                        label="dateTime"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Date &amp; time
                      </TableHeadButton>
                    </th>
                    <th
                      rowSpan="2"
                      data-variant="large"
                    >
                      <TableHeadButton
                        label="location"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Location
                      </TableHeadButton>
                    </th>
                    <th
                      rowSpan="2"
                      data-variant="narrow"
                    >
                      <TableHeadButton
                        label="distance"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Distance
                      </TableHeadButton>
                    </th>
                    <th
                      rowSpan="2"
                      data-variant="narrow"
                    >
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
                    <th data-variant="narrow">
                      <TableHeadButton
                        label="durationMoving"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Moving
                      </TableHeadButton>
                    </th>
                    <th data-variant="narrow">
                      <TableHeadButton
                        label="durationStopped"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Stopped
                      </TableHeadButton>
                    </th>
                    <th data-variant="narrow">
                      <TableHeadButton
                        label="speedMoving"
                        activeLabel={sortBy}
                        onClick={handleTableHeadClick}
                        isAscending={isAscending}
                      >
                        Moving
                      </TableHeadButton>
                    </th>
                    <th data-variant="narrow">
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
                <tbody>
                  {hikes.map(({ _id, dates, relativeDates, ...hike }, hikeIndex) => (
                    <tr
                      key={_id}
                      data-index={hikeIndex % 2 === 0 ? 'even' : 'odd'}
                    >
                      <td data-variant="medium">
                        <em>{relativeDates.hiked}</em>
                        <span>{dates.hiked}</span>
                      </td>
                      <td data-variant="large">{hike.location}</td>
                      <td
                        data-variant="narrow"
                        data-alignment="end"
                      >
                        {hike.distance.toFixed(2)} <span>km</span>
                      </td>
                      {hike.elevationGain === 0 && (
                        <td
                          data-variant="narrow"
                          data-alignment="end"
                        >
                          -
                        </td>
                      )}
                      {hike.elevationGain > 0 && (
                        <td
                          data-variant="narrow"
                          data-alignment="end"
                        >
                          {hike.elevationGain} <span>m</span>
                        </td>
                      )}
                      <td
                        data-variant="narrow"
                        data-alignment="end"
                      >
                        {hike.hours.moved}
                      </td>
                      <td
                        data-variant="narrow"
                        data-alignment="end"
                      >
                          {hike.hours.stopped}
                      </td>
                      <td
                        data-variant="narrow"
                        data-alignment="end"
                      >
                          {hike.speedMoving.toFixed(2)} <span>km/h</span>
                      </td>
                      <td
                        data-variant="narrow"
                        data-alignment="end"
                      >
                          {hike.speedOverall.toFixed(2)} <span>km/h</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

HikesOverview.propTypes = {
  hikes: PropTypes.array.isRequired,
  amount: PropTypes.number.isRequired,
  isAddingDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onFetch: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

export default HikesOverview;
