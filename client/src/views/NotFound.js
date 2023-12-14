import Canvas from 'components/Canvas';

const NotFound = () => (
  <Canvas>
    <header
      className="stream__header"
      role="banner"
    >
      <h2>404 - Not Found</h2>
    </header>
    <ul>
      <li>Did you enter the correct URL?</li>
      <li>Isn't the link you followed outdated?</li>
      <li>Machine uprising?</li>
    </ul>
  </Canvas>
);

export default NotFound;
