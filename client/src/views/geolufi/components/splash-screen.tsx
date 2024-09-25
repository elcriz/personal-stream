import { Language, LanguageLabel } from '../types';

const labels: LanguageLabel = {
  welcome: { nl: 'Geo leren? Laat je overhoren door Geolufi!', en: 'Learning geography? Test yourself with Geolufi!' },
  text: { nl: 'Selecteer het juiste antwoord. Hoe sneller je kiest, ho hoger je kunt scoren.', en: 'Select the correct answers. The faster you choose, the higher your score can become!' },
  startButton: { nl: 'Start nieuw spel', en: 'Start new game' },
};

interface SpashScreenProps {
  language: Language;
  onClick: () => void;
}

function SplashScreen({ language, onClick }: SpashScreenProps) {
  return (
    <div className="splash-screen">
      <h2 className="splash-screen__heading">
        {labels.welcome[language]}
      </h2>
      <div className="splash-screen__text">
        {labels.text[language]}
      </div>
      <button
        className="button button--primary"
        onClick={onClick}
        type="button"
      >
        {labels.startButton[language]}
      </button>
    </div>
  );
}

export { SplashScreen };
