export const API_BASE_URL = 'https://api.aroomy.com';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'error');
  }

  return response.json();
};

const authenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useExchangeGoogleTokenMutation = () => {
  const exchangeToken = async ({ exchangeTokenV1Request }: { exchangeTokenV1Request: any }) => {
    const response = await apiRequest('/v1/auth/google/exchange', {
      method: 'POST',
      body: JSON.stringify(exchangeTokenV1Request),
    });

    return response;
  };
  
  return [exchangeToken];
};

export const useLazyGetGoogleAuthUrlQuery = () => {
  const getGoogleAuthUrl = async ({ redirectUri }: { redirectUri: string }) => {
    const response = await apiRequest(`/v1/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`, {
      method: 'GET',
    });
    console.log(response, 'response');
    return response;
  };
  
  return [getGoogleAuthUrl];
};

export const useLazyGetUsersQuery = () => {
  const getUsers = async () => {
    const response = await authenticatedRequest('/v1/users/me', {
      method: 'GET',
    });
    
    return response;
  };
  
  return [getUsers];
};

export const useLoginMutation = () => {
  const login = async ({ loginV1Request }: { loginV1Request: any }) => {
    try {
      const response = await apiRequest('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginV1Request),
      });

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  return [login];
};

export const useRequestOtpMutation = () => {
  const requestOtp = async ({ requestOtpV1Request }: { requestOtpV1Request: any }) => {
    const response = await apiRequest('/v1/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify(requestOtpV1Request),
    });

    return response;
  };
  
  return [requestOtp];
};

export const useVerifyOtpMutation = () => {
  const verifyOtp = async ({ verifyOtpV1Request }: { verifyOtpV1Request: any }) => {
    try {
      const response = await apiRequest('/v1/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify(verifyOtpV1Request),
      });

      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };
  
  return [verifyOtp];
};
