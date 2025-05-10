import { useState, useContext, createContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const userData = await apiLogin(credentials);
    setUser(userData);
    return userData;
  };

  const register = async (credentials) => {
    const userData = await apiRegister(credentials);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
  };
}
