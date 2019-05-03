// @ts-check

const tokenKey = (userId, role) => `user:${userId}:role:${role}`;

export function storeAccessToken(token, userId, role, _default = false) {
  const key = tokenKey(userId, role);

  window.localStorage.setItem(key, token);
  if (_default) {
    window.localStorage.defaultTokenKey = key;
  }
}

export function selectAccessToken(userId, role) {
  window.sessionStorage.tokenKey = tokenKey(userId, role);
}

export function getAccessToken() {
  let tokenKey = window.sessionStorage.tokenKey;
  if (!tokenKey) {
    tokenKey = window.localStorage.defaultTokenKey;
  }
  return window.localStorage.getItem(tokenKey);
}
