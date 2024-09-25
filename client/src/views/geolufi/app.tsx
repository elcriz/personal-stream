import { useEffect, useState } from 'react';
import config from './config';
import gameService from './services/game-service';
import { GameType, Language, LanguageLabel, Message, Question } from './types';

import './css/main.css';

import { SplashScreen } from './components/splash-screen';
import { GameBar } from './components/game-bar';
import { EndScreen } from './components/end-screen';
import { GameScreen } from './components/game-screen';
import { MessageBox } from './components/message-box';


const labels: LanguageLabel = {
  correct: { nl: 'Goedzo! :)', en: 'Well done! :)' },
  incorrect: { nl: 'Dat was fout :(', en: 'That was incorrect :(' },
};

function Geolufi() {
  const [language, setLanguage] = useState<Language>('nl');
  const [game, setGame] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState<Message>();
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [isDone, setIsDone] = useState(false);

  const [timer, setTimer] = useState(100);

  const handleStartClick = () => {
    gameService.europe.getCountries()
      .then((geoItems) => {

        // Shuffle geo items
        const shuffledItems = geoItems.slice().sort(() => Math.random() - 0.5);

        // Create new game
        const gameToLoad: Question[] = shuffledItems.map((item) => ({
          item,
          options: [
            ...shuffledItems
              .filter(({ id }) => id !== item.id)
              .slice(0, config.optionsAmount - 1)
              .map(({ id }) => id),
            item.id,
          ].slice().sort(() => Math.random() - 0.5),
        }));

        // Set up new game
        setGame(gameToLoad);
      })
      .catch(({ message }) => {
        setError(message);
        setGame([]);
      })
  };

  // Handle a given answer
  const handleAnswer = (selectedOption: number) => {
    const extraScore = Math.round(timer / 10);
    setTimer(100);

    // Given answer was incorrect
    if (selectedOption !== game[step].item.id) {
      setMessage({ variant: 'incorrect', text: labels.incorrect[language] });
      return;
    }

    // Given answer was correct
    setMessage({ variant: 'correct', text: labels.correct[language] });
    setScore((currentScore) => currentScore + config.optionsAmount + extraScore);
  };

  // Reset the game
  const handleResetClick = () => {
    setGame([]);
    setMessage(undefined);
    setStep(0);
    setTimer(100);
    setScore(0);
    setError('');
    setIsDone(false);
  };

  // Show result message and continue to the next step if applicable
  useEffect(() => {
    if (message) {
      const messageVisibleTimeout = setTimeout(() => {
        setMessage(undefined);

        // End the game if applicable
        if ((step + 1) === game.length) {
          setIsDone(true);
          return;
        }

        setStep((currentStep) => {
          return (currentStep + 1) < game.length ? currentStep + 1 : currentStep;
        });

      }, config.messageTimeout);
      return () => {
        clearTimeout(messageVisibleTimeout);
      };
    }
  }, [message]);

  useEffect(() => {
    if (game.length > 0) {
      const interval = setInterval(() => {
        if (message) {
          return;
        }
        setTimer((currentTimer) => {
          return currentTimer - 1 === 0 ? 0 : currentTimer - 1;
        });
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [game, message]);

  return (
    <div className="game">
      <GameBar
        language={language}
        score={score}
        step={`${step + 1} / ${game?.length}`}
        onSelectLanguage={setLanguage}
        onResetClick={handleResetClick}
        isInGame={game.length > 0}
      />
      <main className="game__content">
        {game.length === 0 && (
          <SplashScreen
            language={language}
            onClick={handleStartClick}
          />
        )}
        {!isDone && game.length > 0 && (
          <GameScreen
            language={language}
            game={game}
            step={step}
            stepIndicator={`${step + 1} / ${game?.length}`}
            gameType={config.gameType as GameType}
            mapImageFilename={config.mapImageFilename}
            onAnswer={handleAnswer}
          />
        )}
        {isDone && (
          <EndScreen
            language={language}
            score={score}
            maxScore={config.optionsAmount * game.length + (game.length * 10)}
            onClick={handleResetClick}
          />
        )}

        {!isDone && game.length > 0 && (
          <div className="timer">
            {(timer > 0) && (
              <div
                className='timer__bar'
                style={{ width: `${timer}%` }}
              />
            )}
          </div>
        )}
        {message && <MessageBox message={message} />}
      </main>
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  )
}

export { Geolufi };
