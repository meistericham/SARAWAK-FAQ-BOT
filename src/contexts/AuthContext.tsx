import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'USER';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock users database
const mockUsers = [
  {
    id: 'admin-1',
    email: 'hisyamudin@sarawaktourism.com',
    password: '11223344',
    profile: {
      id: 'admin-1',
      email: 'hisyamudin@sarawaktourism.com',
      full_name: 'Hisyamudin Admin',
      role: 'ADMIN' as const,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    // Check for stored session
    const storedUser = localStorage.getItem('askSarawak_user');
    const storedProfile = localStorage.getItem('askSarawak_profile');
    
    if (storedUser && storedProfile) {
      try {
        const userData = JSON.parse(storedUser);
        const profileData = JSON.parse(storedProfile);
        console.log('✅ Restored session from localStorage');
        setUser(userData);
        setProfile(profileData);
      } catch (error) {
        console.error('❌ Failed to restore session:', error);
        localStorage.removeItem('askSarawak_user');
        localStorage.removeItem('askSarawak_profile');
      }
    }
    
    // Always set loading to false after checking localStorage
    setTimeout(() => {
      console.log('✅ Auth initialization complete');
      setLoading(false);
    }, 100);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in for:', email);
    
    // Find user in mock database
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      console.log('❌ Invalid credentials');
      throw new Error('Invalid email or password');
    }
    
    console.log('✅ Credentials valid, signing in...');
    
    // Set user and profile
    setUser({ id: mockUser.id, email: mockUser.email });
    setProfile(mockUser.profile);
    
    // Store in localStorage
    localStorage.setItem('askSarawak_user', JSON.stringify({ id: mockUser.id, email: mockUser.email }));
    localStorage.setItem('askSarawak_profile', JSON.stringify(mockUser.profile));
    
    console.log('✅ Sign in successful');
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('📝 Attempting sign up for:', email);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      profile: {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        role: 'USER' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    };
    
    mockUsers.push(newUser);
    
    // Set user and profile
    setUser({ id: newUser.id, email: newUser.email });
    setProfile(newUser.profile);
    
    // Store in localStorage
    localStorage.setItem('askSarawak_user', JSON.stringify({ id: newUser.id, email: newUser.email }));
    localStorage.setItem('askSarawak_profile', JSON.stringify(newUser.profile));
    
    console.log('✅ Sign up successful');
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    setUser(null);
    setProfile(null);
    localStorage.removeItem('askSarawak_user');
    localStorage.removeItem('askSarawak_profile');
    console.log('✅ Sign out complete');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) throw new Error('No profile to update');
    
    console.log('📝 Updating profile:', updates);
    const updatedProfile = { 
      ...profile, 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    
    setProfile(updatedProfile);
    localStorage.setItem('askSarawak_profile', JSON.stringify(updatedProfile));
    
    // Update in mock database
    const userIndex = mockUsers.findIndex(u => u.id === profile.id);
    if (userIndex !== -1) {
      mockUsers[userIndex].profile = updatedProfile;
    }
    
    console.log('✅ Profile updated');
  };

  const isAdmin = profile?.role === 'ADMIN';

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}