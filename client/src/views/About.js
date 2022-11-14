import React from 'react';
import Canvas from '../components/Canvas';

const About = () => {
  return (
    <Canvas size="wide">
      <header className="stream__header" role="banner">
        <h2>About</h2>
      </header>
      <p>I'm Christiaan Hemerik. Welcome to my personal stream.</p>

      <p>I wanted have my own place for sharing short updates of things that interest me, free from the constraints of social media, tracking scripts, cookies and more.</p>

      <p>Is this my blog then, you might ask? No, just consider this my personal 'mind dump'. There are no rules to which my 'posts' will have to adhere. No minimum amount of characters, no obligatory photo or image. Neither do I have to commit myself to share at least an X amount of posts per week.</p>

      <p>As both a developer and a designer for many years, I wanted to build it myself so I could learn from it and play with it, and this is the result.</p>

      <h3>About me</h3>

      <p>If you want to know more about me, or what I do for a living, check out my <a className="link" href="https://christiaanhemerik.com/" target="_blank" rel="noopener noreferrer">personal website</a>.</p>

      <p>If you're interested in the code that powers this thing you're looking at? Check out its <a className="link" href="https://github.com/elcriz/personal-stream" target="_blank" rel="noopener noreferrer">repository on GitHub</a>.</p>

      <p>If you want to stay updated without having to visit every single time? Hook up your RSS reader to <a className="link" href="/feed.xml" target="_blank" rel="noopener noreferrer">my feed</a>. (<a className="link" href="https://aboutfeeds.com" target="_blank" rel="noopener noreferrer">what is RSS?</a>)</p>
    </Canvas>
  );
};

export default About;
