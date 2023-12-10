import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Stream from './views/Stream';
import Login from './views/Login';
import Register from './views/Register';
import AddOrModify from './views/AddOrModify';
import Item from './views/Item';
import About from './views/About';
import Hikes from './views/hikes/Hikes';
import NotFound from './views/NotFound';
import Header from './components/Header';
import PrivateWrapper from './components/PrivateWrapper';
import useAuth from './hooks/useAuth';

import { WhamHunter } from './views/whamhunter/WhamHunter';

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
            path="/:slug"
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
            path="/whamhunter"
            exact
            element={(<WhamHunter />)}
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
          <Route element={(
            <PrivateWrapper
              isAuthenticated={auth.user.isAllowedToAdd}
            />
          )}>
            <Route
              path="/modify/:id"
              exact
              element={(<AddOrModify />)}
            />
          </Route>
          <Route element={(
            <PrivateWrapper
              isAuthenticated={auth.user.isAllowedToAdd}
            />
          )}>
            <Route
              path="/hikes"
              exact
              element={(<Hikes />)}
            />
          </Route>
          <Route
            path="*"
            element={(<NotFound />)}
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
