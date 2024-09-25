import { GameType, Language, LanguageLabel, Question } from '../types';

const labels: LanguageLabel = {
  step: { nl: 'Vraag', en: 'Question' },
  mapAltText: { nl: 'Kaart', en: 'Map' },
  answer: { nl: 'Antwoord', en: 'Answer' },
  whichCountry: { nl: 'Welk land is dit?', en: 'Which country is this?' },
  whichCity: { nl: 'Welke stad is dit?', en: 'Which city is this?' },
  whichMountainRange: { nl: 'Welk gebergte is dit?', en: 'Which mountain range is this?' },
  whichRiver: { nl: 'Welke rivier is dit?', en: 'Which river is this?' },
  whichCapital: { nl: 'Welke hoofdstad is dit?', en: 'Which capital city is this?' },
  whichArea: { nl: 'Welke regio of gebied is dit?', en: 'Which region or area is this?' },

  // Temporary game title
  gameTitle: { nl: 'Europese landen', en: 'European countries' },
};

interface GameScreenProps {
  language: Language;
  game: Question[];
  step: number;
  stepIndicator: string;
  gameType: GameType;
  mapImageFilename: string;
  onAnswer: (selectedOption: number) => void;
}

function GameScreen({
  language,
  game,
  step,
  stepIndicator,
  gameType,
  mapImageFilename,
  onAnswer,
}: GameScreenProps) {
  const { options } = game[step];

  const currentPosition = {
    x: `${game[step].item.position.x}%`,
    y: `${game[step].item.position.y}%`,
  }

  const getAnswerLabelByOption = (option: number) => {
    const result = game.find((answer) => answer.item.id === option) as Question;
    return result.item.name[language];
  };

  return (
    <div className="game-screen">
      <div className="game-screen__map-container">
        <h1 className="game-screen__heading">
          {labels.gameTitle[language]}
        </h1>
        <img src={`geolufi/img/${mapImageFilename}`} alt={labels.mapAltText[language]} />
        <span
          className={`geo-item geo-item--${gameType}`}
          style={{
            left: currentPosition.x,
            top: currentPosition.y,
          }}
        />
      </div>
      <aside className="game-screen__question question">
        <h2 className="question__heading">
          <span>{labels.step[language]} {stepIndicator}:&nbsp;</span>
          {gameType === 'countries' && labels.whichCountry[language]}
          {gameType === 'cities' && labels.whichCity[language]}
          {gameType === 'mountainRanges' && labels.whichMountainRange[language]}
          {gameType === 'rivers' && labels.whichRiver[language]}
          {gameType === 'capitals' && labels.whichCapital[language]}
          {gameType === 'areas' && labels.whichArea[language]}
        </h2>

        <ul className="question__answer-options">
          {options.map((option, optionIndex) => (
            <li key={optionIndex}>
              <span>{labels.answer[language]} {optionIndex + 1}: </span>
              <button
                className="button button--answer"
                onClick={() => onAnswer(option)}
                type="button"
              >
                {getAnswerLabelByOption(option)}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export { GameScreen };
