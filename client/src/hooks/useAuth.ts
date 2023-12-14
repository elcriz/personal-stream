import { useCallback, useContext } from 'react';
import { UserContext } from 'src/context/UserContext';
import usersService from 'src/services/usersService';

const useAuth = () => {
  const { user, addUser, resetUser } = useContext(UserContext);
  const isAuthenticated = !!user?.token;

  const clearUser = () => {
    resetUser();
  };

  const verifyUser = useCallback(() => {
    usersService
      .retrieveRefreshToken()
      .then((data) => {
        setTimeout(verifyUser, 5 * 60 * 1000);
        addUser({
          token: data.token,
          role: data.role,
        });
      })
      .catch(() => {
        clearUser();
      });
  }, [addUser]);

  return {
    verifyUser,
    clearUser,
    setUser: addUser,
    user: {
      token: user?.token,
      role: user?.role,
      isAuthenticated,
      isAllowedToAdd: isAuthenticated && user?.role === 1,
      isAllowedToModify: isAuthenticated && user?.role === 1,
    },
  };
};

export default useAuth;
