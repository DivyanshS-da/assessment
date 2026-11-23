import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { cognifyDb } from '@/lib/store';

interface AuthContextType {
  currentUser: UserProfile;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  loginAs: (userId: string) => void;
  registerStudent: (name: string, email: string, department: string) => UserProfile;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profiles = cognifyDb.getProfiles();
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    profiles.find((p) => p.role === 'faculty') || profiles[0]
  );

  useEffect(() => {
    // Sync with store updates
    const current = cognifyDb.getProfiles().find((p) => p.id === currentUser.id);
    if (current) setCurrentUser(current);
  }, []);

  const switchRole = (newRole: UserRole) => {
    const matchingProfile = cognifyDb.getProfiles().find((p) => p.role === newRole);
    if (matchingProfile) {
      setCurrentUser(matchingProfile);
    }
  };

  const loginAs = (userId: string) => {
    const found = cognifyDb.getProfiles().find((p) => p.id === userId);
    if (found) setCurrentUser(found);
  };

  const registerStudent = (name: string, email: string, department: string) => {
    const newStudent = cognifyDb.registerStudent(name, email, department);
    setCurrentUser(newStudent);
    return newStudent;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        switchRole,
        loginAs,
        registerStudent,
        isAdmin: currentUser.role === 'admin',
        isFaculty: currentUser.role === 'faculty',
        isStudent: currentUser.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
