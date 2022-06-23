import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Stream from './views/Stream';
import Login from './views/Login';
import Register from './views/Register';
import AddOrModify from './views/AddOrModify';
import Item from './views/Item';
import About from './views/About';
import Header from './components/Header';
import PrivateWrapper from './components/PrivateWrapper';
import useAuth from './hooks/useAuth';

const App = () => {
  const auth = useAuth();

  useEffect(() => {
    auth.verifyUser();
  }, []);

  return (
    <>
      <Header />
      <main
        className="main"
        aria-label="Content"
      >
        <Routes>
          <Route
            path="/"
            exact
            element={(<Stream />)}
          />
          <Route
            path="/:id"
            exact
            element={(<Item />)}
          />
          <Route
            path="/about"
            exact
            element={(<About />)}
          />
          <Route
            path="/login"
            exact
            element={(<Login />)}
          />
          <Route element={(
            <PrivateWrapper
              isAuthenticated={!auth.user.isAuthenticated}
            />
          )}>
            <Route
              path="/register"
              exact
              element={(<Register />)}
            />
          </Route>
          <Route element={(
            <PrivateWrapper
              isAuthenticated={auth.user.isAllowedToAdd}
            />
          )}>
            <Route
              path="/add"
              exact
              element={(<AddOrModify />)}
            />
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
