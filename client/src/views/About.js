import React from 'react';
import Canvas from '../components/Canvas';

const About = () => {
  return (
    <Canvas isWide>
      <header className="stream__header" role="banner">
        <h2>About</h2>
      </header>
      <p>Welcome to my personal stream.</p>
      <p>I felt the need to have my own place for sharing short updates of what I'm doing, thinking, seeing, liking and listening to, free from the constraints of social media, cookies, tracking scripts and more.</p>
      <p>It is available to anyone who is interested, and there are no rules: no minimum amount of characters, no story arcs etc. Just consider this my mind dump - with everything that makes me... me, and interests me.</p>
      <p>As a developer and designer, I wanted to build it myself so I could learn from it and play with it, and this is the result.</p>
      <p>If you want to know more about me, or what I do for a living, <a className="link" href="https://christiaanhemerik.com/" target="_blank">check out my personal website</a>.</p>
    </Canvas>
  );
};

export default About;
