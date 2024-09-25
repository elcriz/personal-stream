import { useEffect } from 'react';
import { Route, Routes } from 'react-router';

import Header from 'src/components/Header';
import PrivateWrapper from 'src/components/PrivateWrapper';
import useAuth from 'src/hooks/useAuth';
import About from 'src/views/About';
import AddOrModify from 'src/views/AddOrModify';
import Hikes from 'src/views/hikes/Hikes';
import Item from 'src/views/Item';
import Login from 'src/views/Login';
import NotFound from 'src/views/NotFound';
import Register from 'src/views/Register';
import Stream from 'src/views/Stream';

import { WhamHunter } from 'src/views/whamhunter/WhamHunter';
import { Geolufi } from 'src/views/geolufi/app';

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
            element={<Stream />}
          />
          <Route
            path="/:slug"
            element={<Item />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/whamhunter"
            element={<WhamHunter />}
          />
          <Route
            path="/geolufi"
            element={<Geolufi />}
          />
          <Route element={<PrivateWrapper isAuthenticated={!auth.user.isAuthenticated} />}>
            <Route
              path="/register"
              element={<Register />}
            />
          </Route>
          <Route element={<PrivateWrapper isAuthenticated={auth.user.isAllowedToAdd} />}>
            <Route
              path="/add"
              element={<AddOrModify />}
            />
          </Route>
          <Route element={<PrivateWrapper isAuthenticated={auth.user.isAllowedToAdd} />}>
            <Route
              path="/modify/:id"
              element={<AddOrModify />}
            />
          </Route>
          <Route element={<PrivateWrapper isAuthenticated={auth.user.isAllowedToAdd} />}>
            <Route
              path="/hikes"
              element={<Hikes />}
            />
          </Route>
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
