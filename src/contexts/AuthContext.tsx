import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
      api.getCurrentUser().then(({ data }) => {
        if (data) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await api.register(email, password);
    if (error) throw new Error(error);
    if (data) {
      localStorage.setItem('token', data.token);
      api.setToken(data.token);
      setUser(data.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await api.login(email, password);
    if (error) throw new Error(error);
    if (data) {
      localStorage.setItem('token', data.token);
      api.setToken(data.token);
      setUser(data.user);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    api.setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
