import axios from 'axios'
import {
  storeInLocalStorage,
  getFromLocalStorage,
  updateUserToken,
  parseJwt,
} from '@edulastic/api/src/utils/Storage'
import notification from '@edulastic/common/src/components/Notification'
import * as Sentry from '@sentry/browser'
import { debounce } from 'lodash'
import config from '../config'
import { getAccessToken, getTraceId, initKID, initTID } from './Storage'

const ASSETS_REFRESH_STAMP = 'assetsRefreshDateStamp'

const ErrStatRegex = /5[0-9][0-9]/

const NOT_SUPER_ADMIN = 'NOT_SUPER_ADMIN'

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
  if (pathname.includes('/verify')) {
    return pathname
  }

  return '/login'
}

export function getUserFromRedux() {
  return window?.getStore()?.getState()?.user || {}
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
    const currentUserFromRedux = getUserFromRedux()
    const { currentChild } = currentUserFromRedux
    const { role: userRole, children } = currentUserFromRedux?.user || {}
    if (userRole === 'parent' && currentChild && children?.length > 0) {
      return children.find((child) => child._id === currentChild)?.token
    }
  } catch (e) {
    console.warn('error parentSstudent', e)
  }
}

function getPublicAuthToken(_config) {
  try {
    if (
      ['/public/', '/math/', '/evaluate-as-student/'].find((x) =>
        _config.url?.includes(x)
      )
    ) {
      return config.publicAuthToken
    }
    return false
  } catch (e) {
    console.warn('Error public auth token', e)
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

function addReloadedEntryToSession() {
  const reloads = JSON.parse(
    window.sessionStorage.districtMismatchReloads || '[]'
  )
  reloads.push({ time: Date.now() })
  window.sessionStorage.districtMismatchReloads = JSON.stringify(reloads)
}

function getReloadsHappenedRecently() {
  const reloads = JSON.parse(
    window.sessionStorage.districtMismatchReloads || '[]'
  )
  const now = Date.now()
  return reloads.filter((x) => now - x.time < 15 * 1000) // assuming 5 seconds for each reload
}

export function forceLogout() {
  const loginRedirectUrl = localStorage.getItem('loginRedirectUrl')
  localStorage.clear()
  localStorage.setItem('loginRedirectUrl', loginRedirectUrl)
  if (
    !window.location.pathname.toLocaleLowerCase().includes(getLoggedOutUrl())
  ) {
    localStorage.setItem('loginRedirectUrl', getCurrentPath())
  }
}

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
      try {
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
          getParentsStudentToken(_config) ||
          defaultToken ||
          getAccessToken() ||
          getPublicAuthToken(_config)
        const currentUserFromRedux = getUserFromRedux()
        const userDistrictId = currentUserFromRedux?.user?.currentDistrictId
        const districtIdFromToken = token ? parseJwt(token)?.districtId : null
        if (
          token &&
          userDistrictId &&
          districtIdFromToken &&
          userDistrictId !== districtIdFromToken
        ) {
          console.warn('DISTRICTID switched: so reloading')
          const recentReloads = getReloadsHappenedRecently()
          if (recentReloads.length > 2) {
            Sentry.captureMessage(
              `multiple districts mismatch infinite reload`,
              'info'
            )
            forceLogout()
            notification({
              type: 'error',
              msg:
                'There is a problem authenticating your account. Please contact us at support@edulastic.com to resolve the issue',
            })
            setTimeout(() => {
              window.location.href = '/login'
            }, 5000)
            return
          }
          const { user = {} } = currentUserFromRedux || {}
          const { orgData = {} } = user
          const { districts = [] } = orgData
          const currentDistrictName = districts.find(
            (x) => x.districtId === districtIdFromToken
          ).districtName
          // debouncing to prevent concurrent apis to be interpreted as repeated reloads
          debounce(addReloadedEntryToSession, 700)()
          notification({
            className: 'showOne-notification customized-notification',
            type: 'info',
            msg: `We are switching you to ${currentDistrictName} as you can login to only one district at a time`,
          })
          setTimeout(() => {
            window.location.href = '/'
          }, 5000)
        }
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
      } catch (e) {
        console.warn('error', e)
        Sentry.captureException(e)
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
        let err
        if (data.response?.status === 500) {
          err = new Error(
            `Sorry, you have hit an unexpected error and the product team has been notified. We will fix it as soon as possible. url: ${reqUrl}: message: ${
              data.response?.data?.message || 'NA'
            }`
          )
        } else {
          err = new Error(data.response?.data?.message || 'NA')
        }

        // make the response available so anyone can read it.
        err.status = data.response?.status
        err.response = data.response

        if (
          err.status === 403 &&
          err?.response?.data?.message === NOT_SUPER_ADMIN
        ) {
          window.location.reload()
        }

        // log in to sentry, exclude low priority status
        if (err.status && String(err.status).match(ErrStatRegex)) {
          Sentry.withScope((scope) => {
            const fingerPrint = getUrlFragment(reqUrl) || reqUrl

            scope.setLevel('error')
            scope.setTag('ref', data.response?.headers?.['x-server-ref'])
            Sentry.captureMessage('api error', 'debug')
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
            sessionStorage.setItem('tokenExpired', true)
            Sentry.withScope((scope) => {
              scope.setTag('issueType', 'ForcedRedirection')
              const token = getAccessToken()
              if (token) {
                const { _id: userId, exp, iat } = parseJwt(token)
                scope.setExtra('tokenExpiryDetails', {
                  exp,
                  iat,
                  userId,
                })
              }
            })
            forceLogout()
            const message = data?.response?.data?.message || ''
            if (
              message.includes('jwt must be provided') ||
              message.includes('jwt expired')
            ) {
              window.dispatchEvent(new Event('user-token-expired'))
              return Promise.resolve({ data: { result: null } })
            }
            window.location.href = '/login'
          }
          if (
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

        if (
          data?.response?.status === 409 &&
          data.response.data?.message === 'oldToken'
        ) {
          // disabling sentry , since the session is no longer valid
          if (Sentry?.getCurrentHub()?.getClient()?.getOptions()?.enabled) {
            Sentry.getCurrentHub().getClient().getOptions().enabled = false
          }
          // returning skeleton reponses to avoid erroring out in Api call
          sessionStorage.setItem('tokenExpired', true)
          return Promise.resolve({ data: { result: null } })
        }
      }
    )
  }

  callApi({ method = 'get', ...rest }) {
    return this.instance({ method, ...rest })
  }
}
