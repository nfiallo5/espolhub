import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '@/api/auth';
import { getMyProfile } from '@/api/sellers';
import { hasValidToken, clearTokens } from '@/api/client';
import { Seller, RegisterData, Faculty } from '@/types';

interface AuthContextType {
  user: Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    faculty: Faculty;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (hasValidToken()) {
        try {
          const profile = await getMyProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await apiLogin({ email, password });
    setUser(authData.seller);
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    faculty: Faculty;
    password: string;
    password_confirmation: string;
  }) => {
    const registerData: RegisterData = {
      seller: data,
    };
    await apiRegister(registerData);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (hasValidToken()) {
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
