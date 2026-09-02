import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStorage } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStorage.get()) { setLoading(false); return; }
    // Só derruba a sessão quando o servidor de fato rejeita o token (401/404) — uma
    // falha de rede passageira (aba abrindo rápido, backend acordando no free tier,
    // um blip qualquer) não pode apagar o login do usuário silenciosamente.
    api.me().then(setUser).catch((err) => {
      if (err.status === 401 || err.status === 404) tokenStorage.clear();
    }).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login({ email, password });
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const register = async (email, password, name, profile) => {
    const { token, user } = await api.register({ email, password, name, profile });
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
