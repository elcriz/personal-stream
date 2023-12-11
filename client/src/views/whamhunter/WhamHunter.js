import { useState, useEffect } from 'react';
import whamHunterService from './WhamHunterService';
import { getSortedByProperty } from '../../helpers/arrayHelper';
import './wham-hunter.css';

const defaultErrorMessage = 'Wham! Er ging iets mis! Probeer het later nog een keer :-(';

const WhamHunter = () => {
  const [name, setName] = useState('');
  const [userInfo, setUserInfo] = useState(undefined);
  const [players, setPlayers] = useState([]);
  const [scoreTimeMs, setScoreTimeMs] = useState(0);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const sortedPlayers = ((hasScores) => {
    return hasScores
      ? getSortedByProperty(players, 'score', 'desc')
      : players.reverse();
  })(!!players.find((player => player.score > 0)))

  const fetchPlayers = () => {
    setError('');
    setIsFetching(true);
    whamHunterService.retrievePlayers()
      .then((items) => {
        setPlayers(items);
      })
      .catch((e) => {
        console.error(e);
        setError(defaultErrorMessage);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const getUserInfoFromStorage = () => {
    const data = window.localStorage.getItem('whamhunter');
    if (!data) {
      setUserInfo(undefined);
      return;
    }
    try {
      const parsed = JSON.parse(data);
      setUserInfo({ name: parsed.name, score: parsed.score, _id: parsed._id });
    } catch(e) {
      console.error(e);
      setError(defaultErrorMessage);
    }
  };

  const addUserInfoToStorage = (overwrite) => {
    try {
      window.localStorage.setItem('whamhunter', JSON.stringify(overwrite || userInfo));
    } catch(e) {
      console.error(e);
      setError(defaultErrorMessage);
    }
  };

  const handleSubmitLogin = () => {
    const playerName = name.trim();
    if (players.find((player => player.name === playerName))) {
      setError('Deze speler bestaat al. Kies een andere naam!');
      return;
    }

    setError('');
    whamHunterService.addPlayer(playerName)
      .then((item) => {
        setName('');
        setUserInfo(item);
      })
      .catch((e) => {
        console.error(e);
        setError(defaultErrorMessage);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const handleAddScore = () => {
    const currentTimeMs = Date.now();
    if (currentTimeMs - scoreTimeMs < 30000) { // 30 seconds wait time
      setError('Ho ho, niet zo snel! Niemand hoort Last Christmas zó vaak... xD');
      return;
    }
    setError('');
    whamHunterService.addScore(userInfo._id)
      .then((overwrite) => {
        setScoreTimeMs(Date.now()); // Set time AFTER scoring
        setUserInfo(overwrite);
      })
      .catch((e) => {
        console.error(e);
        setError(defaultErrorMessage);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const handleSelectPlayer = (playerToSelect) => {
    setUserInfo(playerToSelect);
  };

  useEffect(() => {
    document.title = 'Wham! Hunter';
    getUserInfoFromStorage();
    return () => {
      document.title = 'Chris\ Stream';
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      addUserInfoToStorage();
    }
    if (!isFetching) {
      fetchPlayers();
    }
  }, [userInfo]);

  useEffect(() => {
    setError('');
  }, [name]);

  useEffect(() => {
    if (scoreTimeMs !== 0) {
      const waitTimer = setTimeout(() => {
        setScoreTimeMs(0);
      }, 30000);
      return () => {
        clearTimeout(waitTimer);
      }
    }
  }, [scoreTimeMs]);

  return (
    <div className="wham-hunter">
      <div className="wham-hunter__inner">
        <header>
          <img src="/wham-main.png" alt="Last Christmas!" />
          <h1>Wham! Hunter</h1>
          {userInfo && (
            <span>{userInfo.name}</span>
          )}
        </header>

        {isFetching && (
          <div className="loader">
            Bezig met ophalen data...
          </div>
        )}

        {!isFetching && (
          <>
            {!userInfo && (
              <>
                <form className="wham-hunter__login-form">
                  <p>Welkom bij Wham Hunter! Zo te zien heb je nog niet eerder meegespeeld. Vul je naam in om mee te doen:</p>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Vul je naam in..."
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                    <button
                      className="wham-hunter__button"
                      type="button"
                      onClick={handleSubmitLogin}
                      disabled={name.length < 2}
                    >
                      Meedoen
                    </button>
                  </div>
                </form>

                {players.length > 0 && (
                  <div className="wham-hunter__select-user">
                    <h2>Al meegespeeld?</h2>
                    <p>Klik dan op je naam om verder te gaan:</p>
                    <ul className="wham-hunter__players">
                      {getSortedByProperty(players, 'name').map((player, playerIndex) => (
                        <li key={playerIndex}>
                          <button
                            className="wham-hunter__player-name"
                            type="button"
                            onClick={() => {
                              handleSelectPlayer(player);
                            }}
                          >
                            {player.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="disclaimer">In de verleiding om een andere naam te kiezen? Dat kan, maar hou het eerlijk! ;-) Deze applicatie is binnen een uurtje ontwikkeld en heeft geen ingewikkelde authenticatie...</p>
                  </div>
                )}
              </>
            )}

            {userInfo && (
              <>
                <div className="game">
                  <h2>Last Christmas gehoord?</h2>
                  <p>Yes! Laat het ons direct weten:</p>
                  <button
                    className="wham-hunter__button wham-hunter__button--xl"
                    type="button"
                    onClick={handleAddScore}
                    disabled={scoreTimeMs > 0}
                  >
                    {scoreTimeMs > 0 && 'GOED BEZIG !'}
                    {scoreTimeMs === 0 && (
                      <>
                        {userInfo.score === 0 ? 'Ik heb \'m gehoord!' : 'Ik hoorde \'m weer!'}
                      </>
                    )}
                  </button>
                  {scoreTimeMs > 0 && (
                    <img src="/whammed.png" alt="George" />
                  )}
                </div>

                <div className="scores">
                  <h2>Scorelijst</h2>
                  {players.length === 0 && (
                    <p>Nog niemand heeft gescoord. Ga jij de eerste zijn? ;-)</p>
                  )}
                  {players.length > 0 && (
                    <ol className="wham-hunter__players wham-hunter__players--scores">
                      {sortedPlayers.map((player, playerIndex) => (
                        <li key={playerIndex}>
                          <div className="player__placement">{playerIndex + 1}.</div>
                          <div className="player__name">{player.name}</div>
                          <div className="player__score">{player.score}</div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                <p className="disclaimer">In de verleiding om 2x te klikken? Denk twee keer na. Hou het eerlijk en hou het leuk ;-)</p>
              </>
            )}
          </>
        )}

        {error !== '' && (
          <div className="error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export { WhamHunter };
