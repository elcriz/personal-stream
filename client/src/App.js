import React, { useCallback, useContext, useEffect } from 'react';
import {
  Route,
  Routes,
} from 'react-router';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Stream from './pages/Stream';
import Login from './pages/Login';
import Register from './pages/Register';
import Add from './pages/Add';
import Item from './pages/Item';
import About from './pages/About';
import { UserContext, initialState } from './context/UserContext';

const App = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const isLoggedIn = !!userContext.token;

  const verifyUser = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}users/refreshToken`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        setTimeout(verifyUser, 5 * 60 * 1000);
        if (!response.ok) {
          setUserContext(previous => ({
            ...previous,
            ...initialState,
          }));
          return;
        }
        const data = await response.json();
        setUserContext(previous => ({
          ...previous,
          token: data.token,
          role: data.role,
        }));
      })
      .catch(() => {
        console.error('Refresh token could not be fetched');
      });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <>
      <Header
        userRole={userContext.role}
        isLoggedIn={isLoggedIn}
      />
      <main
        className="main"
        aria-label="Content"
      >
        <Routes>
          <Route
            path="/"
            exact
            element={(
              <Stream />
            )}
          />
          <Route
            path="/:id"
            exact
            element={(
              <Item userRole={userContext.role} />
            )}
          />
          <Route
            path="/about"
            exact
            element={(
              <About />
            )}
          />
          <Route
            path="/login"
            exact
            element={(
              <Login />
            )}
          />
          <Route
            path="/register"
            exact
            element={(
              <Register />
            )}
          />
          <Route
            path="/add"
            exact
            element={(
              <PrivateRoute>
                <Register />
              </PrivateRoute>
            )}
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
