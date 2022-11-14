import React from 'react'
import { Link } from 'react-router-dom';
import usersService from '../services/usersService';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const auth = useAuth();

  const handleLogout = (event) => {
    event.preventDefault();

    usersService.retrieveLogout(auth.user.token)
      .then(() => {
        auth.clearUser();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <header className="header">
      <h1>
        <Link to="/">Chris' Stream</Link>
      </h1>
      <nav aria-label="Main">
        <Link className="link" to="/">Stream</Link>
        <Link className="link" to="/about">About</Link>
        {auth.user.isAllowedToAdd && (
          <>
            <Link className="link" to="/add">Add</Link>
            <Link className="link" to="/hikes">Hikes</Link>
          </>
        )}
        {auth.user.isAuthenticated && (
          <button
            className="header__button button button--secondary button--90"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
