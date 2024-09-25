import { Language, LanguageLabel } from '../types';

const labels: LanguageLabel = {
  headingWellDone: { nl: 'Goed gedaan!', en: 'Well done!' },
  headingMwah: { nl: 'Dat kan beter...', en: 'You can do better...' },
  yourScore: { nl: 'Je score is', en: 'Your score is' },
  points: { nl: 'punten', en: 'points' },
  maxPoints: { nl: 'Het maximale aantal punten dat je met dit spel kunt behalen is:', en: 'The maximum number of points you can earn in this game is:' },
  startOverButton: { nl: 'Begin opnieuw', en: 'Start again' },
};

interface EndScreenProps {
  language: Language;
  score: number;
  maxScore: number;
  onClick: () => void;
}

function EndScreen({ language, score, maxScore, onClick }: EndScreenProps) {
  return (
    <div className="end-screen">
      <h2 className="end-screen__heading">
        {score < (maxScore / 2) && labels.headingMwah[language]}
        {score >= (maxScore / 2) && labels.headingWellDone[language]}
      </h2>
      <div className="end-screen__summary">
        {labels.yourScore[language]} <em>{score}</em> {labels.points[language]}.<br />{labels.maxPoints[language]} {maxScore}.
      </div>
      <button
        className="button button--primary"
        onClick={onClick}
        type="button"
      >
        {labels.startOverButton[language]}
      </button>
    </div>
  );
}

export { EndScreen };
