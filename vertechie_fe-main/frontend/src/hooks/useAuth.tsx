/**
 * Authentication Hook
 * React hook for authentication state and actions
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { authService, User, LoginCredentials, RegisterData } from '../services';
import { isAuthenticated, clearTokens } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!user && isAuthenticated();

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(credentials);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      await authService.register(data);
      // Auto-login after registration
      await login({ email: data.email, password: data.password });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    authService.logout();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) return;

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

