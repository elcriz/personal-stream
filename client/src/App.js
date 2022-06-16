import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Stream from './pages/Stream';
import Login from './pages/Login';
import Register from './pages/Register';
import AddOrModify from './pages/AddOrModify';
import Item from './pages/Item';
import About from './pages/About';
import Header from './components/Header';
import PrivateWrapper from './components/PrivateWrapper';
import useAuth from './hooks/useAuth';

const App = () => {
  const auth = useAuth();

  useEffect(() => {
    auth.verifyUser();
  }, [auth.verifyUser]);

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
          <Route
            path="/register"
            exact
            element={(<Register />)}
          />
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
