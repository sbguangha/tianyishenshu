import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  phone: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const AuthService = {
  getToken: (): string | null => localStorage.getItem('token'),
  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
        return JSON.parse(user) as User;
    } catch {
        return null;
    }
  },
  isAuthenticated: (): boolean => !!localStorage.getItem('token'),
  logout: (): void => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  },
  clearAuth: (): void => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  },
  saveAuth: (token: string, user: User): void => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  },
  authenticatedFetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('token');
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  }
}; 