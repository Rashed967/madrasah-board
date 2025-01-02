// Service to handle authentication tokens and authorization

interface User {
  _id: string;
  username: string;
  role: string;
  madrasah: string | null;
  isDeleted: boolean;
  lastPasswordChangeTime: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthData {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// Store tokens and user data
export const setTokens = (authData: AuthData) => {
  // Store in cookie
  document.cookie = `access_token=${authData.accessToken}; path=/; max-age=86400; secure; samesite=strict`;
  
  // Also store in localStorage for client-side access
  localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.user));
};

// Get tokens and user data
export const getTokens = (): Partial<AuthData> => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || '',
  user: JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
});

// Remove all tokens and user data
export const clearTokens = () => {
  // Clear cookie
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Clear localStorage
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Parse JWT token without library
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

// Check if user is authenticated with valid token
export const isAuthenticated = (): boolean => {
  const { accessToken } = getTokens();
  return !!accessToken && !isTokenExpired(accessToken);
};

// Get authorization header with token validation
export const getAuthHeader = (): { Authorization: string } | {} => {
  const { accessToken } = getTokens();
  if (!accessToken || isTokenExpired(accessToken)) {
    return {};
  }
  return { Authorization: `Bearer ${accessToken}` };
};

// Get user role from stored user data
export const getUserRole = (): string | null => {
  const { user } = getTokens();
  return user?.role || null;
};

// Check if user has required role
export const hasRole = (requiredRole: string): boolean => {
  const userRole = getUserRole();
  if (requiredRole === 'admin') {
    return userRole === 'admin' || userRole === 'super-admin';
  }
  return userRole === requiredRole;
};

// Get dashboard route based on user role
export const getDashboardRoute = (): string => {
  const role = getUserRole();
  
  switch (role) {
    case 'super-admin':
    case 'admin':
      return '/dashboard';
    case 'madrasah':
      return '/dashboard/madrasah';
    case 'teacher':
      return '/dashboard/teacher';
    default:
      return '/login';
  }
};

// Get current user data
export const getCurrentUser = (): User | null => {
  const { user } = getTokens();
  return user || null;
};

// Logout user
export const logout = () => {
  clearTokens();
  // Use window.location.href for a full page refresh to clear any cached state
  window.location.href = '/login';
};
