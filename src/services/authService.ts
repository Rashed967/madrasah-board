// Service to handle authentication tokens and authorization

interface Tokens {
  accessToken: string;
}

const ACCESS_TOKEN_KEY = 'access_token';

// Store access token in localStorage
export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Get access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Remove access token from localStorage
export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

// Get authorization header
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
