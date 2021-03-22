import axios from 'axios'
import {
  storeInLocalStorage,
  getFromLocalStorage,
  updateUserToken,
} from '@edulastic/api/src/utils/Storage'
import * as Sentry from '@sentry/browser'
import config from '../config'
import { getAccessToken, getTraceId, initKID, initTID } from './Storage'

const ASSETS_REFRESH_STAMP = 'assetsRefreshDateStamp'

const ErrStatRegex = /5[0-9][0-9]/

const getCurrentPath = () => {
  const location = window.location
  return `${location.pathname}${location.search}${location.hash}`
}

const getUrlFragment = (url = '') => {
  if (!url) return

  const parts = url
    .replace(/(^\w+:|^)\/\//, '')
    .split('/')
    .slice(0, 3)

  return parts.join('/')
}

const getWordsInURLPathName = (pathname) => {
  // When u try to change this function change the duplicate function in "src/client/common/utils/helpers.js" also
  let path = pathname
  path += ''
  path = path.split('/')
  path = path.filter((item) => item)
  return path
}

const getLoggedOutUrl = () => {
  // When u try to change this function change the duplicate function in "src/client/student/Login/ducks.js" also
  const path = getWordsInURLPathName(window.location.pathname)
  const pathname = window.location.pathname.toLocaleLowerCase()
  if (pathname === '/getstarted') {
    return '/getStarted'
  }
  if (pathname === '/signup') {
    return '/signup'
  }
  if (pathname === '/studentsignup') {
    return '/studentsignup'
  }
  if (
    pathname === '/login' &&
    (window.location.hash.includes('register') ||
      window.location.hash.includes('signup'))
  ) {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  }
  if (pathname === '/adminsignup') {
    return '/adminsignup'
  }
  if (
    path[0] &&
    ['district', 'districtlogin'].includes(path[0].toLocaleLowerCase()) &&
    path[1]
  ) {
    const arr = [...path]
    arr.shift()
    const restOfPath = arr.join('/')
    const [, districtLogin] = window.location.pathname?.split('/')
    return `/${districtLogin || 'districtLogin'}/${restOfPath}`
  }
  if (pathname === '/resetpassword') {
    return window.location.href.split(window.location.origin)[1]
  }
  if (pathname === '/inviteteacher') {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  }

  return '/login'
}

function getParentsStudentToken(_config) {
  try {
    if (_config.method !== 'get') {
      return false
    }

    if (
      [
        '/user/me',
        '/logout',
        '/login',
        '/signUp',
        '/user/parent-code',
      ].find((x) => _config.url?.includes(x))
    ) {
      return false
    }
    const currentUserFromRedux = window?.getStore()?.getState()?.user || {}
    const { currentChild } = currentUserFromRedux
    const { role: userRole, children } = currentUserFromRedux?.user || {}
    if (userRole === 'parent' && currentChild && children?.length > 0) {
      return children.find((child) => child._id === currentChild)?.token
    }
  } catch (e) {
    console.warn('error parentSstudent', e)
  }
}

/**
 * A helper to check if the date object is a a valid one
 * @param {Date} d
 *
 */
const isValidDate = (d) => d instanceof Date && Number.isFinite(Number(d))

/**
 * A helper to get difference in ms for dates
 */
const diffInSeconds = (dt2, dt1) => (dt2.getTime() - dt1.getTime()) / 1000

/** A small function to compare semver versions
 * TODO: Move this into utils, if needed at multiple places
 */
const SemverCompare = (a, b) => {
  const pa = a.split('.')
  const pb = b.split('.')
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i])
    const nb = Number(pb[i])
    if (na > nb) return 1
    if (nb > na) return -1
    if (!Number.isNaN(na) && Number.isNaN(nb)) return 1
    if (Number.isNaN(na) && !Number.isNaN(nb)) return -1
  }
  return 0
}

const tokenUpdateHeader = 'x-token-refresh'
const kidUpdateHeader = 'x-kid-refresh'

export default class API {
  constructor(baseURL = config.api, defaultToken = false) {
    this.baseURL = baseURL

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.instance.interceptors.request.use((_config) => {
      // there are some APIs which take more time than the others,
      // such APIs are routed to another url which will use a aws lambda with much higher timeout
      // some of the example APIs are in packages/api/src/reports.js
      if (_config.useSlowApi) {
        _config.baseURL = config.apis || _config.baseURL
      }
      _config['client-epoch'] = Date.now().toString()
      _config.headers['X-Client-Time'] = new Date().toISOString()
      _config.headers['X-Client-Tz-Offset'] = new Date().getTimezoneOffset()
      if (window.localStorage.getItem('originalreferrer')) {
        _config.headers['X-Orig-Referrer'] = window.localStorage.getItem(
          'originalreferrer'
        )
      }
      const token =
        getParentsStudentToken(_config) || defaultToken || getAccessToken()
      if (token) {
        _config.headers.Authorization = token
      }
      // Initialise browser tab id
      initTID()
      // Initialise kid for unauthenticated user
      initKID()
      if (window.sessionStorage) {
        _config.headers['X-Amzn-Trace-Id'] = getTraceId()
      }
      return _config
    })
    this.instance.interceptors.response.use(
      (response) => {
        const appVersion = process.env.__CLIENT_VERSION__ || 'NA'
        const serverAppVersion = response.headers['server-version'] || ''

        // store the info in window object
        window.__CLIENT_VERSION__ = appVersion
        window.__SERVER_VERSION__ = serverAppVersion
        const updatedToken = response.headers[tokenUpdateHeader]
        // const oldAccessToken = getAccessToken();
        if (updatedToken) {
          updateUserToken(updatedToken, response.headers[kidUpdateHeader])
          // TODO: if needed , implement responding to access token changes
          /* if (oldAccessToken && oldAccessToken != updatedToken) {
            window.dispatchEvent(new Event('access-token-updated'));
          } */
        }

        // if the server version is higher than the client version, then try to resync
        if (
          appVersion &&
          serverAppVersion &&
          SemverCompare(serverAppVersion, appVersion) === 1
        ) {
          const lastAssetRefresh = new Date(
            parseInt(getFromLocalStorage(ASSETS_REFRESH_STAMP), 10)
          )
          const currentDate = new Date()
          const lastRefreshDate = isValidDate(lastAssetRefresh)
            ? lastAssetRefresh
            : currentDate
          const diffInSec = diffInSeconds(currentDate, lastRefreshDate)

          // retry only if 15 minutes are passed or there was no time stamp stored.
          if (diffInSec > 0 && diffInSec < 45 * 60) return response

          storeInLocalStorage(ASSETS_REFRESH_STAMP, new Date().getTime())

          console.warn('++++ App Version Mismatch +++')
          console.warn(
            `++++ Server: ${serverAppVersion}  Client: ${serverAppVersion}  +++`
          )

          const event = new Event('request-client-update')
          window.dispatchEvent(event)
        }
        return response
      },
      (data) => {
        const reqUrl = data.response?.config?.url || 'NA'
        const err = new Error(
          `Sorry, you have hit an unexpected error and the product team has been notified. We will fix it as soon as possible. url: ${reqUrl}: message: ${
            data.response?.data?.message || 'NA'
          }`
        )

        // make the response available so anyone can read it.
        err.status = data.response?.status
        err.response = data.response

        // log in to sentry, exclude low priority status
        if (err.status && String(err.status).match(ErrStatRegex)) {
          Sentry.withScope((scope) => {
            const fingerPrint = getUrlFragment(reqUrl) || reqUrl

            scope.setLevel('error')
            scope.setTag('ref', data.response?.headers?.['x-server-ref'])
            Sentry.captureException(err)
            scope.setTag('issueType', 'UnexpectedErrorAPI')
            scope.setFingerprint(['{{default}}', fingerPrint])
            scope.setContext('api_meta', {
              res: data.response?.data || {},
              ref: data.response?.headers?.['x-server-ref'],
              req: data.response?.config?.data,
            })
            scope.setExtra('api_res', JSON.stringify(data.response?.data || {}))
            scope.setExtra(
              'api_ref',
              data.response?.headers?.['x-server-ref'] || '--'
            )
            scope.setExtra(
              'api_req',
              JSON.stringify(data.response?.config?.data || {})
            )
          })
        }

        if (data && data.response && data.response.status) {
          if (data.response.status === 401) {
            Sentry.withScope((scope) => {
              scope.setTag('issueType', 'ForcedRedirection')
            })
            // Needs proper fixing, patching it to fix infinite reload
            const loginRedirectUrl = localStorage.getItem('loginRedirectUrl')
            localStorage.clear()
            localStorage.setItem('loginRedirectUrl', loginRedirectUrl)
            if (
              !window.location.pathname
                .toLocaleLowerCase()
                .includes(getLoggedOutUrl())
            ) {
              localStorage.setItem('loginRedirectUrl', getCurrentPath())
            }
            window.location.href = '/login'
          } else if (
            data.response.status === 409 &&
            data.response.data?.message === 'oldToken'
          ) {
            window.dispatchEvent(new Event('student-session-expired'))
          }
        }
        if (
          !(
            data?.response?.status === 409 &&
            data.response.data?.message === 'oldToken'
          )
        ) {
          return Promise.reject(err)
        }
      }
    )
  }

  callApi({ method = 'get', ...rest }) {
    return this.instance({ method, ...rest })
  }
}
