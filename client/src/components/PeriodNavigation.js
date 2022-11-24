import React from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from './SegmentedControl';

const types = ['Year', 'Month'];

const PeriodNavigation = ({
  period,
  isLoading,
  setPeriod,
}) => {
  const periodType = period.length === 2 ? types[1] : types[0];

  const handlePeriodClick = (toAddOrsubstract) => {
    if (periodType === types[0]) {
      setPeriod([period[0] + toAddOrsubstract]);
      return;
    }
    setPeriod(toAddOrsubstract >= 0
      ? (period[1] === 11 ? [(period[0] + 1), 0] : [period[0], (period[1] + 1)])
      : (period[1] === 0 ? [(period[0] - 1), 11] : [period[0], (period[1] - 1)])
    );
  };

  const handlePeriodTypeChange = (type) => {
    const today = new Date();
    const periodToSet = [today.getFullYear()];
    setPeriod(type === types[1]
      ? [...periodToSet, today.getMonth()]
      : periodToSet
    );
  };

  return (
    <div
      className="period-navigation"
      data-variant={isLoading ? 'loading' : 'loaded'}
    >
      <SegmentedControl
        id="period"
        className="period-navigation__segmented-control"
        options={types}
        value={periodType}
        onChange={handlePeriodTypeChange}
      />

      <nav className="period-navigation__actions">
        <div className="period-navigation__period-indicator">
          {period.length > 1 ? `${period[1] + 1}-` : ''}
          {period[0]}
        </div>
        <button
          className="period-navigation__button period-navigation__button--previous button button--secondary button--90"
          type="button"
          title="Previous"
          onClick={() => {
            handlePeriodClick(-1);
          }}

        />
        <button
          className="period-navigation__button period-navigation__button--next button button--secondary button--90"
          type="button"
          title="Next"
          onClick={() => {
            handlePeriodClick(1);
          }}
        />
      </nav>
    </div>
  );
};

PeriodNavigation.propTypes = {
  period: PropTypes.arrayOf(
    PropTypes.number.isRequired,
    PropTypes.number,
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  setPeriod: PropTypes.func.isRequired,
};

export default PeriodNavigation;
