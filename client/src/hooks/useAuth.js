import { useContext, useCallback } from 'react';
import usersService from '../services/usersService';
import { UserContext, initialState } from '../context/UserContext';

const useAuth = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const isAuthenticated = !!userContext.token;

  const verifyUser = useCallback(() => {
    usersService.retrieveRefreshRoken()
      .then((data) => {
        setTimeout(verifyUser, 5 * 60 * 1000);
        setUserContext(previous => ({
          ...previous,
          token: data.token,
          role: data.role,
        }));
      })
      .catch((error) => {
        setUserContext(previous => ({
          ...previous,
          ...initialState,
        }));
      });
  }, [setUserContext]);

  return {
    verifyUser,
    user: {
      token: userContext.token,
      role: userContext.role,
      isAuthenticated,
      isAllowedToAdd: isAuthenticated && userContext.role === 1,
      isAllowedToModify: isAuthenticated && userContext.role === 1,
    },
  };
};

export default useAuth;
