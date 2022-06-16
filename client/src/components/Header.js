import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const auth = useAuth();

  return (
    <header className="header">
      <h1>
        <Link to="/">Chris' Stream</Link>
      </h1>
      <nav aria-label="Main">
        <Link className="link" to="/">Stream</Link>
        <Link className="link" to="/about">About</Link>
        {auth.user.isAllowedToAdd && (
          <Link className="link" to="/add">Add</Link>
        )}
        {auth.user.isAuthenticated && (
          <Link className="link" to="/logout">Sign out</Link>
        )}
        {!auth.user.isAuthenticated && (
          <Link className="link" to="/login">Sign in</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
