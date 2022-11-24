import React, { useState, useRef, useEffect } from 'react';
import hikesService from '../../services/hikes/hikesService';
import useAuth from '../../hooks/useAuth';
import Hike from '../../models/hikes/Hike';
import Canvas from '../../components/Canvas';
import PeriodNavigation from '../../components/PeriodNavigation';
import HikesOverview from '../../components/hikes/HikesOverview';
import AddHikeModal from '../../components/hikes/AddHikeModal';

const Hikes = () => {
  const [period, setPeriod] = useState([new Date().getFullYear()]);
  const [hikes, setHikes] = useState([]);
  const [totals, setTotals] = useState({});
  const [filteredAmount, setFilteredAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHikeToAddVisible, setIsHikeToAddVisible] = useState(false);

  const auth = useAuth();
  const firstUpdate = useRef(true);

  const handleAddSubmit = (
    hikeToAdd = new Hike(),
    callback,
    event,
  ) => {
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

  const fetchHikes = (
    sortBy = 'dateTime',
    isAscending = false,
  ) => {
    setIsFetching(true);
    setError('');

    hikesService
      .retrieveHikes(
        auth.user.token,
        period,
        sortBy,
        isAscending,
      )
      .then(({
        filteredAmount: newFilteredAmount,
        amount: newAmount,
        totals: newTotals,
        hikes: newHikes,
      }) => {
        setFilteredAmount(newFilteredAmount);
        setAmount(newAmount);
        setTotals(newTotals);
        setHikes(newHikes);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (!firstUpdate.current) {
      fetchHikes();
    }
    firstUpdate.current = false;
  }, [period]);

  return (
    <Canvas
      size="full"
      hasTopBorder
    >
      <PeriodNavigation
        period={period}
        isLoading={isFetching}
        setPeriod={setPeriod}
      />

      <HikesOverview
        hikes={hikes}
        month={period[1]}
        year={period[0]}
        amount={filteredAmount}
        isFirstUpdate={firstUpdate.current}
        isAddingDisabled={isHikeToAddVisible}
        isLoading={isFetching}
        onFetch={fetchHikes}
        onAddClick={() => {
          setIsHikeToAddVisible(true);
        }}
      />

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
