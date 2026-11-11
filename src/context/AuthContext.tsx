import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthSession, UserRole } from '../types/auth';

const STORAGE_KEYS = {
  SESSION: 'smart_grocery_auth_v1',
  USERS: 'smart_grocery_users_v1',
};

// Default accounts seeded for demo
const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-root',
    name: 'System Administrator',
    email: 'admin@smartgrocery.com',
    role: 'admin',
    mobile: '+91 98000 00001',
    password: 'Admin@123',
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'user-customer-demo',
    name: 'Priya Sharma',
    email: 'customer@smartgrocery.com',
    role: 'customer',
    mobile: '+91 98765 43210',
    password: 'Customer@123',
    createdAt: '2026-03-01T00:00:00Z',
  },
];

interface AuthContextType {
  session: AuthSession | null;
  currentUser: AuthSession['user'] | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  currentPath: string;
  navigate: (path: string) => void;
  login: (email: string, password: string, requiredRole: UserRole) => { success: boolean; error?: string };
  registerCustomer: (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) => { success: boolean; error?: string };
  resetCustomerPassword: (email: string, newPass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Current URL Route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Users Database in LocalStorage
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [users]);

  // 3. Active Session in LocalStorage
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.user?.role) return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      console.error('Failed to update auth session', e);
    }
  }, [session]);

  // Login handler
  const login = (
    email: string,
    password: string,
    requiredRole: UserRole
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        error: `No account found with ${email}. Please check the email address or register.`,
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    if (user.role !== requiredRole) {
      if (requiredRole === 'admin') {
        return {
          success: false,
          error: 'This account does not have Admin privileges. Please use the Customer Login portal.',
        };
      } else {
        return {
          success: false,
          error: 'This is an Admin account. Please log in through the Admin Login portal.',
        };
      }
    }

    const newSession: AuthSession = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        createdAt: user.createdAt,
      },
      token: `token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      loginTime: new Date().toISOString(),
    };

    setSession(newSession);

    // Redirect to respective dashboard
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }

    return { success: true };
  };

  // Customer Registration
  const registerCustomer = (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please log in instead.',
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: cleanEmail,
      mobile: data.mobile.trim(),
      password: data.password,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);

    // Automatically log in newly registered customer
    const newSession: AuthSession = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'customer',
        mobile: newUser.mobile,
        createdAt: newUser.createdAt,
      },
      token: `token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      loginTime: new Date().toISOString(),
    };

    setSession(newSession);
    navigate('/dashboard');

    return { success: true };
  };

  // Customer Password Reset
  const resetCustomerPassword = (
    email: string,
    newPass: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === 'customer'
    );

    if (userIndex === -1) {
      return {
        success: false,
        error: 'No registered customer account found with this email.',
      };
    }

    setUsers((prev) => {
      const updated = [...prev];
      updated[userIndex] = { ...updated[userIndex], password: newPass };
      return updated;
    });

    return { success: true };
  };

  // Logout
  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      console.error('Failed to clear session from LocalStorage', e);
    }
    setSession(null);
    // Replace current history entry with '/' to prevent browser back navigation reopening protected dashboards
    try {
      window.history.replaceState({}, '', '/');
    } catch (e) {
      console.error(e);
    }
    setCurrentPath('/');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        currentUser: session?.user || null,
        role: session?.user?.role || null,
        isAuthenticated: !!session,
        currentPath,
        navigate,
        login,
        registerCustomer,
        resetCustomerPassword,
        logout,
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
