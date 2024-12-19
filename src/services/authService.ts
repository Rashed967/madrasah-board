// Service to handle authentication tokens and authorization

interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Store tokens
export const setTokens = (tokens: Tokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
};

// Get tokens
export const getTokens = (): Tokens => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || '',
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || '',
});

// Remove all tokens
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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
  const token = getTokens().accessToken;
  if (!token) return false;
  return !isTokenExpired(token);
};

// Get authorization header with token validation
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getTokens().accessToken;
  if (!token || isTokenExpired(token)) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};
