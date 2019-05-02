// @ts-check

const tokenKey = (userId, role) => `user:${userId}:role:${role}`;

export function storeAccessToken(token, userId, role) {
  const key = tokenKey(userId, role);
  window.localStorage.setItem(key, token);
}

export function selectAccessToken(userId, role) {
  window.sessionStorage.tokenKey = tokenKey(userId, role);
}

export function getAccessToken() {
  const tokenKey = window.sessionStorage.tokenKey;
  return window.localStorage.getItem(tokenKey);
}
