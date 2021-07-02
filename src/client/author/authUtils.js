import { userApi, TokenStorage } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { history } from '../configureStore'
import { switchDistrictAction } from '../student/Login/ducks'

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
  const newDistrict = newUser.district?._id || ''
  if (newUser._id && newUser._id === oldUser._id) {
    if (newDistrict !== oldUser.orgId) {
      const curPath = window.location.pathname
      history.replace('/')
      // run in next phase of event loop
      setTimeout(() => {
        history.replace(curPath)
        // TODO find better way
        window.onload = () => switchDistrictAction(newDistrict)
      }, 0)
    }
    return
  }
  const switchToId = newUser._id || newUser
  const personId = oldUser.personId || oldUser
  const result = await userApi.getSwitchUser(switchToId, personId)
  if (result.result) {
    TokenStorage.storeAccessToken(
      result.result.token,
      result.result._id,
      result.result.role
    )
    // TODO handle district switching
    window.open(
      `${window.location.protocol}//${window.location.host}/?userId=${result.result._id}&role=${result.result.role}&district=${newDistrict}`,
      '_blank'
    )
  } else {
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

window.proxyUser = proxyUser
window.switchRole = switchRole
window.switchUser = switchUser
