import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { login as loginService } from '../features/auth/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);

    const userData = {
      userId: data.userId,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'tokenType',
      data.tokenType || 'Bearer'
    );
    localStorage.setItem(
      'auth_user',
      JSON.stringify(userData)
    );

    setToken(data.token);
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('auth_user');

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}