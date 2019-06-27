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

export function removeAccessToken(userId, role) {
  const key = tokenKey(userId, role);
  window.localStorage.removeItem(key);
}

export function getAccessToken() {
  let tokenKey = window.sessionStorage.tokenKey;
  if (!tokenKey) {
    tokenKey = window.localStorage.defaultTokenKey;
  }
  return window.localStorage.getItem(tokenKey);
}

export function storeInLocalStorage(key, value) {
  if (window && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
}

export function getFromLocalStorage(key) {
  if (window && window.localStorage) {
    return window.localStorage.getItem(key);
  }
}
