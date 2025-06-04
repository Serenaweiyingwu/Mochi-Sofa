import { cacheUserInfo, cacheUserInfoToken, getCachedUserInfoToken } from './account';
import { API_BASE_URL } from '../api/aroomy-api';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleLoginSuccess = (user: object, token: string, router: AppRouterInstance): void => {
  try {
    cacheUserInfo(user);
    cacheUserInfoToken(token);
    
    document.cookie = `auth_token=${token}; path=/; max-age=2592000; SameSite=Strict; Secure`; 
    
    router.push('/');
  } catch (e) {
    console.error("Login success handling error:", e);
  }
};

export const getTokenFromCookie = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('auth_token=')) {
        return cookie.substring('auth_token='.length);
      }
    }
    return null;
  } catch (e) {
    console.error("Error getting token from cookie:", e);
    return null;
  }
};

export const isLoggedIn = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const token = getCachedUserInfoToken();
    if (token) return true;
    
    const cookieToken = getTokenFromCookie();
    if (cookieToken) {
      cacheUserInfoToken(cookieToken);
      return true;
    }
    
    return false;
  } catch (e) {
    console.error("Error checking login status:", e);
    return false;
  }
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = getCachedUserInfoToken();
    if (!token) return false;
    
    const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        cacheUserInfoToken(data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=2592000; SameSite=Strict; Secure`;
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error("Token refresh error:", e);
    return false;
  }
};

export const logout = (router: AppRouterInstance): void => {
  try {
    const token = getCachedUserInfoToken();
    
    localStorage.removeItem('user_info');
    localStorage.removeItem('user_token');
    
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure;';
    
    if (token) {
      fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).catch(err => console.error('Logout API error:', err));
    }
    
    router.push('/login');
  } catch (e) {
    console.error("Logout error:", e);
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const token = getCachedUserInfoToken();
    if (!token) return false;
    
    const response = await fetch(`${API_BASE_URL}/v1/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch (e) {
    console.error("Token validation error:", e);
    return false;
  }
};
