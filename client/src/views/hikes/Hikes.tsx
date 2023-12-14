/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, FormEvent } from 'react';
import Canvas from 'src/components/Canvas';
import AddHikeModal from 'src/components/hikes/AddHikeModal';
import HikesOverview from 'src/components/hikes/HikesOverview';
import PeriodNavigation from 'src/components/PeriodNavigation';
import useAuth from 'src/hooks/useAuth';
import { HikeModel } from 'src/models/hikes/Hike';
import hikesService, { ISerializedHike } from 'src/services/hikes/hikesService';

function Hikes() {
  const [period, setPeriod] = useState([new Date().getFullYear()]);
  const [hikes, setHikes] = useState<ISerializedHike[]>([]);
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
    hikeToAdd: HikeModel,
    callback: () => void,
    event: FormEvent<HTMLFormElement>,
  ) => {
    if (auth.user.token) {
      event.preventDefault();
      setError('');
      setIsSubmitting(true);

      hikesService
        .createHike(hikeToAdd, auth.user.token)
        .then((hikeAdded) => {
          setHikes((currentHikes) => [hikeAdded, ...currentHikes]);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        })
        .finally(() => {
          setIsSubmitting(false);
          fetchHikes();
          callback();
        });
    }
  };

  const fetchHikes = (sortBy = 'dateTime', isAscending = false) => {
    if (auth.user.token) {
      setIsFetching(true);
      setError('');

      hikesService
        .retrieveHikes(auth.user.token, period, sortBy, isAscending)
        .then(
          ({
            filteredAmount: newFilteredAmount,
            amount: newAmount,
            totals: newTotals,
            hikes: newHikes,
          }) => {
            setFilteredAmount(newFilteredAmount);
            setAmount(newAmount);
            setTotals(newTotals);
            setHikes(newHikes);
          },
        )
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  };

  useEffect(() => {
    console.log(period, firstUpdate.current);
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

      {error && <div className="error">{error}</div>}
    </Canvas>
  );
}

export default Hikes;
