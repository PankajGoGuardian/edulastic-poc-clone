import uuid from 'uuid/v4'
import { configureScope, captureException } from '@sentry/browser'
import { uniq } from 'lodash'
import AppConfig from '../../../../src/app-config'

export const tokenKey = (userId, role) => `user:${userId}:role:${role}`

export function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  )

  return JSON.parse(jsonPayload)
}

/**
 * Sets userId, districtId, role, kid, tid to Sentry for
 * authenticated users, and sets kid & tid for
 * unauthenticated users
 */
export const updateSentryScope = (user) => {
  if (AppConfig.sentryURI) {
    // for authenticated users user will be passed
    if (user && user._id) {
      const { _id, role, districtId, kid } = user
      configureScope((scope) => {
        scope.setUser({ id: _id })
        scope.setTags({
          tid: window.sessionStorage.tid,
          districtId,
          role,
          kid,
        })
      })
    } else if (window.sessionStorage.kid) {
      // In case user is unauthenticated then set kid & tid to Sentry tags
      configureScope((scope) => {
        scope.setTags({
          tid: window.sessionStorage.tid,
          kid: window.sessionStorage.kid,
        })
      })
    }
  }
}

export function storeAccessToken(token, userId, role, _default = false) {
  const key = tokenKey(userId, role)
  window.localStorage.setItem(key, token)
  const tokens = JSON.parse(window.localStorage.getItem('tokens') || '[]')

  window.localStorage.setItem(
    'tokens',
    JSON.stringify([...new Set([...tokens, key])])
  )
  if (_default) {
    window.sessionStorage.defaultTokenKey = key
  }
}

export function selectAccessToken(userId, role) {
  window.sessionStorage.tokenKey = tokenKey(userId, role)
}

/**
 * Update kid after user authentication
 * and sets the same to sentry scope
 * @param {*} user
 */
export function updateKID({ _id, role, districtId, kid }) {
  if (window.sessionStorage) {
    window.sessionStorage.kid = kid
    updateSentryScope({ _id, role, districtId, kid })
  }
}

export function updateUserToken(token, kid) {
  try {
    const { _id: userId, role, districtId } = parseJwt(token)
    storeAccessToken(token, userId, role, true)
    selectAccessToken(userId, role) // in case role changed
    if (kid) {
      updateKID({ _id: userId, role, kid, districtId })
    }
  } catch (e) {
    captureException(e)
  }
}

export function removeAccessToken(userId, role) {
  const key = tokenKey(userId, role)
  const oldTokens = JSON.parse(window.localStorage.getItem('tokens') || '[]')
  window.localStorage.setItem(
    'tokens',
    JSON.stringify(oldTokens.filter((x) => x != key))
  )
  window.localStorage.removeItem(key)
}

export function getAccessTokenForUser(userId, role) {
  const key = tokenKey(userId, role)
  const oldTokens = JSON.parse(window.localStorage.getItem('tokens') || '[]')
  return oldTokens.find((x) => x === key)
}

export function removeTokens() {
  window.localStorage.removeItem('tokens')
}

// Initialise browser tab id
// Will persist till the tab is closed
export const initTID = () => {
  if (
    window.sessionStorage != null &&
    window.sessionStorage.tid !== '' &&
    !window.sessionStorage.tid
  ) {
    window.sessionStorage.tid = uuid.v4()
  }
}

// Initialise kid for unauthenticated user
export const initKID = () => {
  if (
    window.sessionStorage != null &&
    window.sessionStorage.kid !== '' &&
    !window.sessionStorage.kid
  ) {
    window.sessionStorage.kid = uuid.v4()
    updateSentryScope()
  }
}

// Remove kid after user logout
export const removeKID = () => {
  if (window.sessionStorage) {
    delete window.sessionStorage.kid
  }
}

// function to fetch values from sessionStorage
export const getFromSessionStorage = (key) => {
  if (window && window.sessionStorage) {
    return window.sessionStorage.getItem(key)
  }
}

// Trace id -- a way to connect client requests(on ALB) to consumer(lambda)
export const getTraceId = () =>
  `tid=${window.sessionStorage.tid};kid=${window.sessionStorage.kid}`

export function getAccessToken() {
  let _tokenKey = window.sessionStorage.tokenKey
  if (!_tokenKey) {
    _tokenKey = window.sessionStorage.defaultTokenKey
  }
  if (!_tokenKey) {
    // to keep backward compatible
    _tokenKey = window.localStorage.defaultTokenKey
  }
  if (!_tokenKey) {
    const tokens = window.localStorage.getItem('tokens')
    if (tokens) {
      _tokenKey = JSON.parse(tokens)[0]
    }
  }
  return window.localStorage.getItem(_tokenKey)
}

export function getCurrentTokenCreatedTime() {
  const token = getAccessToken()
  const { tokenCreatedTime } = parseJwt(token)
  return tokenCreatedTime
}

/**
 * Removes all user tokens in current browser
 */
export function removeAllTokens() {
  window.sessionStorage.removeItem('tokenKey')
  window.sessionStorage.removeItem('defaultTokenKey')
  window.localStorage.removeItem('defaultTokenKey')
  window.localStorage.removeItem('tokens')
}

export function storeInLocalStorage(key, value) {
  if (window && window.localStorage) {
    window.localStorage.setItem(key, value)
  }
}

export function getFromLocalStorage(key) {
  if (window && window.localStorage) {
    return window.localStorage.getItem(key)
  }
}

export function removeFromLocalStorage(key) {
  if (window && window.localStorage) {
    return window.localStorage.removeItem(key)
  }
}

export function getTokens() {
  return JSON.parse(getFromLocalStorage('tokens')) || []
}
// get proxy parent
// proxy parent is the user who initiated the proxy of another user
export function getProxyParent(roles = []) {
  try {
    const proxyParent = JSON.parse(getFromLocalStorage('proxyParent'))
    if (
      (!roles.length || roles.includes(proxyParent.role)) &&
      proxyParent.role
    ) {
      return proxyParent
    }
    return null
  } catch (e) {
    return null
  }
}

export function addPlaylistIdToDeleted(id) {
  if (window && window.sessionStorage) {
    const { deletedPlaylists = '[]' } = window.sessionStorage
    window.sessionStorage.deletedPlaylists = JSON.stringify(
      uniq([...JSON.parse(deletedPlaylists), id])
    )
  }
}

export function getDeletedPlaylistIds() {
  return JSON.parse(getFromSessionStorage('deletedPlaylists') || '[]')
}

export function tokenExpireInHours() {
  const currentTime = new Date().getTime()
  const token = getAccessToken()
  const tokenParsed = parseJwt(token)
  const timeDiff = (tokenParsed.exp * 1000 - currentTime) / 3600000
  return timeDiff
}
