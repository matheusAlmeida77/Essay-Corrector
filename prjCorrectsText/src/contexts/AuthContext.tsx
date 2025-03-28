
import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // Esta é uma simulação de login
    // Em um app real, você deve validar no backend
    
    // Simulando um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo user para testes
    const demoUser = {
      id: '1',
      name: 'Professor SESI',
      email: email,
      role: 'teacher',
    };
    
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
