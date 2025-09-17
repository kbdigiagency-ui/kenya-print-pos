import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedAuth = localStorage.getItem('kb_auth_session');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          // Check if session is still valid (within 24 hours)
          const sessionTime = new Date(authData.timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - sessionTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setUser(authData.user);
          } else {
            // Session expired, clear it
            localStorage.removeItem('kb_auth_session');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('kb_auth_session');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Demo authentication - replace with real auth later
      if (email === "kbdigiagency@gmail.com" && password === "trial1234") {
        const userData: User = {
          id: "1",
          email: email,
          name: "KB Digital Admin",
          role: "Administrator"
        };
        
        const authSession = {
          user: userData,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('kb_auth_session', JSON.stringify(authSession));
        setUser(userData);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('kb_auth_session');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};