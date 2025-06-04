
export const getCachedUserInfoToken = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem("user_token");
    return token ? JSON.parse(token) : null;
  } catch (e) {
    console.error("Error getting cached user token:", e);
    return null;
  }
};

export const cacheUserInfo = (userInfo: object): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem("user_info", JSON.stringify(userInfo));
  } catch (e) {
    console.error("Error caching user info:", e);
  }
};

export const cacheUserInfoToken = (token: string): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem("user_token", JSON.stringify(token));
  } catch (e) {
    console.error("Error caching user token:", e);
  }
};

export const removeUserInfo = (): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_token");
  } catch (e) {
    console.error("Error removing user info:", e);
  }
};

export const getCachedUserInfo = (): object | null => {
  try {
    if (typeof window === 'undefined') return null;
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (e) {
    console.error("Error getting cached user info:", e);
    return null;
  }
};
