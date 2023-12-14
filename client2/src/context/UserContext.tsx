/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, ReactNode } from 'react';

type User = {
  token: string | null;
  role: number;
};

interface UserContextType {
  user: User | null;
  addUser: (userDate: User) => void;
  resetUser: () => void;
}

const initialState: User = {
  token: null,
  role: 0,
};

const UserContext = createContext<UserContextType>({
  user: null,
  addUser: () => null,
  resetUser: () => null,
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const value = {
    user,
    addUser: (userToAdd: User) => setUser({ ...user, ...userToAdd }),
    resetUser: () => setUser(initialState),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export type { User };

export { UserContext, UserProvider };
