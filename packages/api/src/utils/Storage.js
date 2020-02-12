// @ts-check
import uuid from "uuid/v4";

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

// Initialise browser tab id
// Will persist till the tab is closed
export const initTID = () => {
  if (window.sessionStorage != null && window.sessionStorage.tid !== "" && !window.sessionStorage.tid) {
    window.sessionStorage.tid = uuid.v4();
  }
};

// Initialise kid for unauthenticated user
export const initKID = () => {
  if (window.sessionStorage != null && window.sessionStorage.kid !== "" && !window.sessionStorage.kid) {
    window.sessionStorage.kid = uuid.v4();
  }
};

// Update kid after user authentication
export const updateKID = kid => {
  if (window.sessionStorage) {
    window.sessionStorage.kid = kid;
  }
};

// Remove kid after user logout
export const removeKID = () => {
  if (window.sessionStorage) {
    delete window.sessionStorage.kid;
  }
};

// function to fetch values from sessionStorage
export const getFromSessionStorage = key => {
  if (window && window.sessionStorage) {
    return window.sessionStorage.getItem(key);
  }
};

// Trace id -- a way to connect client requests(on ALB) to consumer(lambda)
export const getTraceId = () => `tid=${window.sessionStorage.tid};kid=${window.sessionStorage.kid}`;

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

export function removeFromLocalStorage(key) {
  if (window && window.localStorage) {
    return window.localStorage.removeItem(key);
  }
}
