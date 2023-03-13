import { userApi, TokenStorage } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { isKioskAppEnabled } from '@edulastic/common/src/helpers'

export async function proxyUser({ userId, email, groupId, currentUser = {} }) {
  const result = await userApi.getProxyUser({ userId, email, groupId })
  if (result.result?._id && result.result?.role) {
    TokenStorage.storeAccessToken(
      result.result.token,
      result.result._id,
      result.result.role
    )
    TokenStorage.storeInLocalStorage('proxyParent', JSON.stringify(currentUser))
    window.open(
      `${window.location.protocol}//${window.location.host}/?userId=${result.result._id}&role=${result.result.role}`,
      '_blank'
    )
  } else {
    notification({ messageKey: 'someErrorOccuredDuringProxying' })
  }
}

export async function switchRole(role) {
  const result = await userApi.getSwitchedToken(role)
  console.log('switch role user', result)
  if (result.result) {
    TokenStorage.storeAccessToken(
      result.result.token,
      result.result.userId,
      result.result.role
    )
    window.open(
      `${window.location.protocol}//${window.location.host}/?userId=${result.result.userId}&role=${result.result.role}`,
      '_blank'
    )
  } else {
    notification({ messageKey: 'someErrorOccuredDuringSwitchingRole' })
  }
}

export async function switchUser(newUser, oldUser) {
  try {
    const districtId = newUser.district?._id || newUser.districts[0]?._id || ''
    const switchToId = newUser._id || newUser
    const personId = oldUser.personId || oldUser
    if (
      newUser._id &&
      newUser._id === oldUser._id &&
      districtId === oldUser.orgId
    ) {
      return
    }
    const result = await userApi.getSwitchUser(
      switchToId,
      personId,
      newUser._id === oldUser._id ? districtId : undefined
    )
    if (result.result) {
      TokenStorage.storeAccessToken(
        result.result.token,
        result.result._id,
        result.result.role
      )
      if (newUser._id && newUser._id === oldUser._id) {
        if (districtId !== oldUser.orgId) {
          window.location.href = `/`
        }
      } else
        window.open(
          `${window.location.protocol}//${window.location.host}/?userId=${result.result._id}&role=${result.result.role}`,
          '_blank'
        )
    } else {
      throw new Error('')
    }
  } catch (err) {
    notification({ messageKey: 'ErrorOccuredSwicthingRole' })
  }
}

export async function proxyDemoPlaygroundUser(isAutomation = false) {
  const result = await userApi.getDemoPlaygroundUser()
  if (result.result?._id && result.result?.role) {
    TokenStorage.storeAccessToken(
      result.result.token,
      result.result._id,
      result.result.role
    )
    // check if qa environment then open proxy account in same tab
    let option = '_blank'
    if (isAutomation) {
      option = '_self'
    }
    window.open(
      `${window.location.protocol}//${window.location.host}/?userId=${result.result._id}&role=${result.result.role}`,
      option
    )
  } else {
    notification({ messageKey: 'someErrorOccuredDuringProxying' })
  }
}

/**
 * @param {'title' | 'info' | 'tooltip'} key
 */
export const safeModeI18nTranslation = (t, key) =>
  t(
    `${
      isKioskAppEnabled() ? 'safeExamBrowserOrKioskMode' : 'safeExamBrowser'
    }.${key}`
  )

window.proxyUser = proxyUser
window.switchRole = switchRole
window.switchUser = switchUser
