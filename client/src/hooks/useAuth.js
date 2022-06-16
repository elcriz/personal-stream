import { useContext, useCallback } from 'react';
import { UserContext, initialState } from '../context/UserContext';

const useAuth = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const isAuthenticated = !!userContext.token

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
