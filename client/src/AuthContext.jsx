import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStorage } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStorage.get()) { setLoading(false); return; }
    api.me().then(setUser).catch(() => tokenStorage.clear()).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login({ email, password });
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const register = async (email, password, name) => {
    const { token, user } = await api.register({ email, password, name });
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  const refresh = () => api.me().then(setUser).catch(() => {});

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
