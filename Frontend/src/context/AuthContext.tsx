import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define types
interface GoogleAuthResponse {
  token: string;
  profileCompleted: boolean;
  hasSelectedProfileType: boolean;
}

interface UserProfileResponse {
  profileType?: string;
  profileDetails?: any;
  profileCompleted: boolean;
}

interface User {
  token: string;
  profileCompleted: boolean;
  hasSelectedProfileType: boolean;
  profileType?: string;
  profileDetails?: any;
}

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  login: (accessToken: string) => Promise<{
    profileCompleted: boolean;
    hasSelectedProfileType: boolean;
  }>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<any>;
}

// Create context with type
const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get<UserProfileResponse>(
        'http://localhost:4000/me',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setCurrentUser({
        token,
        profileCompleted: response.data.profileCompleted,
        hasSelectedProfileType: !!response.data.profileType,
        profileType: response.data.profileType,
        profileDetails: response.data.profileDetails
      });
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  const login = async (accessToken: string) => {
    try {
      const response = await axios.post<GoogleAuthResponse>(
        'http://localhost:4000/auth/google',
        {
          access_token: accessToken
        }
      );
      
      const { token, profileCompleted, hasSelectedProfileType } = response.data;
      localStorage.setItem('token', token);
      
      const userResponse = await axios.get<UserProfileResponse>(
        'http://localhost:4000/me',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const userData: User = {
        token,
        profileCompleted: userResponse.data.profileCompleted,
        hasSelectedProfileType: !!userResponse.data.profileType,
        profileType: userResponse.data.profileType,
        profileDetails: userResponse.data.profileDetails
      };
      
      setCurrentUser(userData);
      
      return { profileCompleted, hasSelectedProfileType };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateProfile = async (profileData: any) => {
    try {
      if (!currentUser) throw new Error('User not logged in');
      
      const response = await axios.post('http://localhost:4000/user/profile', {
        token: currentUser.token,
        profileDetails: profileData,
        complete: true
      });
      
      setCurrentUser(prev => ({
        ...prev!,
        profileDetails: profileData,
        profileCompleted: true
      }));
      
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    currentUser,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}