import { ChangeEvent } from 'react';
import { Language, LanguageLabel } from '../types';

const labels: LanguageLabel = {
  heading: { nl: 'Geolufi', en: 'Geolufi' },
  resetButton: { nl: 'Stop huidig spel', en: 'Stop current game' },
  stopText: { nl: 'Weet je zeker dat je het huidige spel wilt stoppen? Je voortgang gaat verloren!', en: 'Are you sure you want to stop the current game? All progress will be lost!' },
  score: { nl: 'Score', en: 'Score' },
  step: { nl: 'Vraag', en: 'Question' },
};

interface GameBarProps {
  language: Language;
  step: string;
  score: number;
  onSelectLanguage: (language: Language) => void;
  onResetClick: () => void;
  isInGame: boolean;
}

function GameBar({
  language,
  step,
  score,
  onSelectLanguage,
  onResetClick,
  isInGame = false,
}: GameBarProps) {
  const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelectLanguage(event.target.value as Language);
  };

  const handleStopClick = () => {
    if (confirm(labels.stopText[language])) {
      onResetClick();
    }
  };

  return (
    <header className="game-bar">
      <h1 className="game-bar__heading">
        {labels.heading[language]}
      </h1>
      {isInGame && (
        <ul className="game-bar__score-indicator">
          <li>{labels.step[language]}: {step}</li>
          <li>{labels.score[language]}: {score}</li>
        </ul>
      )}
      <aside>
        <select
          className="game-bar__language-selector"
          onChange={handleChangeLanguage}
          value={language}
        >
          <option value="nl">Nederlands</option>
          <option value="en">English</option>
        </select>
        <button
          className="button button--secondary"
          onClick={handleStopClick}
          disabled={!isInGame}
          type="button"
        >
          {labels.resetButton[language]}
        </button>
      </aside>
    </header>
  );
}

export { GameBar };
