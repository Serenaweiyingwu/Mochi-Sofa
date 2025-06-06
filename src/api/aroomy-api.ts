export const API_BASE_URL = "https://api-dev.aroomy.com/";
export const GAME_API_BASE_URL = "http://localhost:8001";

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "error");
    }

    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    return {};
  }
};

const authenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const apiGameRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${GAME_API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "error");
  }

  return response.json();
};

const authenticatedGameRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");
  return apiGameRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useExchangeGoogleTokenMutation = () => {
  const exchangeToken = async ({
    exchangeTokenV1Request,
  }: {
    exchangeTokenV1Request: { code: string; redirectUri: string };
  }) => {
    const response = await apiRequest("v1/auth/google/token", {
      method: "POST",
      body: JSON.stringify(exchangeTokenV1Request),
    });

    return response;
  };

  return [exchangeToken];
};

export const useLazyGetGoogleAuthUrlQuery = () => {
  const getGoogleAuthUrl = async ({ redirectUri }: { redirectUri: string }) => {
    const response = await apiRequest(
      `v1/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`,
      {
        method: "GET",
      }
    );
    console.log(response, "response");
    return response;
  };

  return [getGoogleAuthUrl];
};

export const useLazyGetUsersQuery = () => {
  const getUsers = async () => {
    const response = await authenticatedRequest("v1/users/me", {
      method: "GET",
    });

    return response;
  };

  return [getUsers];
};

export const useInviteMutation = () => {
  const invite = async ({
    inviteV1Request,
  }: {
    inviteV1Request: { user_id: string };
  }) => {
    const response = await authenticatedGameRequest(
      `/api/invitation-game/invite/${inviteV1Request.user_id}`,
      {
        method: "POST",
      }
    );

    return response;
  };

  return [invite];
};

export const useGetCart = () => {
  const cartResponse = async () => {
    const response = await authenticatedGameRequest(`/api/shopify/cart`, {
      method: "POST",
    });

    return response;
  };

  return [cartResponse];
};

export const useGetCartLink = () => {
  const cartLinkResponse = async (cart_id: string) => {
    const response = await authenticatedGameRequest(`/api/shopify/generate-cart-link`, {
      method: "POST",
      body: JSON.stringify({ cart_id }),
    });
    return response;
  }
  return [cartLinkResponse];
}; 
  

export const useAddtoCart = () => {
  const addResponse = async (cartItem: {
    variant_id: string;
    quantity: number;
    properties: {
      title: string;
      variant: string;
      image?: string;
    };
  }) => {
    const response = await authenticatedGameRequest(`/api/shopify/cart/items`, {
      method: "POSt",
      body: JSON.stringify(cartItem),
    });

    return response;
  };

  return [addResponse];
};
export const useCheckout = () => {
  const checkoutResponse = async (cart_id: string) => {
    const response = await authenticatedGameRequest(`/api/shopify/checkout`, {
      method: "POSt",
      body: JSON.stringify({cart_id}),
    });

    return response;
  };

  return [checkoutResponse];
};


export const useGetColorQuery = () => {
  const getColorResponse = async () => {
    const response = await authenticatedGameRequest(`/api/shopify/product-color/${8226712584384}`, {
      method: "GET",
    });
    return response;}
    return [getColorResponse];
  }

export const useGetInviteQuery = (userId: string) => {
  const inviteResponse = async () => {
    const response = await authenticatedGameRequest(
      `/api/invitation-game/invitation/${userId}`,
      {
        method: "GET",
      }
    );

    return response;
  };

  return [inviteResponse];
};

export const useCompleteGameMutation = () => {
  const completeGameResponse = async (completeGameV1Request: {
    invitation_id: string;
    score: number;
    user_id: string;
  }) => {
    const response = await authenticatedGameRequest(
      `/api/invitation-game/complete-game`,
      {
        method: "POST",
        body: JSON.stringify(completeGameV1Request),
      }
    );

    return response;
  };

  return [completeGameResponse];
};

export const useGetCouponMutation = (userId: string) => {
  const getCouponResponse = async () => {
    const response = await authenticatedGameRequest(
      `/api/invitation-game/coupon/${userId}`,
      {
        method: "GET",
      }
    );

    return response;
  };

  return [getCouponResponse];
};

export const useLoginMutation = () => {
  interface LoginV1Request {
    contact: string;
    type: string;
    password: string;
  }

  const login = async ({
    loginV1Request,
  }: {
    loginV1Request: LoginV1Request;
  }) => {
    try {
      const response = await apiRequest("v1/auth/login", {
        method: "POST",
        body: JSON.stringify(loginV1Request),
      });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return [login];
};

export const useRequestOtpMutation = () => {
  interface RequestOtpV1Request {
    type: string;
    password?: string;
    contact: string;
  }

  const requestOtp = async ({
    requestOtpV1Request,
  }: {
    requestOtpV1Request: RequestOtpV1Request;
  }) => {
    const response = await apiRequest("v1/auth/request-otp", {
      method: "POST",
      body: JSON.stringify(requestOtpV1Request),
    });

    return response;
  };

  return [requestOtp];
};

export const useVerifyOtpMutation = () => {
  interface VerifyOtpV1Request {
    type: string;
    contact: string;
    code: string;
  }

  const verifyOtp = async ({
    verifyOtpV1Request,
  }: {
    verifyOtpV1Request: VerifyOtpV1Request;
  }) => {
    try {
      const response = await apiRequest("v1/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(verifyOtpV1Request),
      });

      return response;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  return [verifyOtp];
};
