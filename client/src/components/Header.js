import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({
  isLoggedIn,
}) => (
  <header className="header">
    <h1>
      <Link to="/">Chris' Stream</Link>
    </h1>
    <nav aria-label="Main">
      <Link className="link" to="/">Stream</Link>
      <Link className="link" to="/about">About</Link>
      {isLoggedIn && (
        <>
          <Link className="link" to="/login">Sign in(debug)</Link>
          <Link className="link" to="/logout">Sign out</Link>
        </>
      )}
      {!isLoggedIn && (
        <Link className="link" to="/login">Sign in</Link>
      )}
    </nav>
  </header>
);

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
