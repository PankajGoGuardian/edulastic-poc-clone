import { get } from 'lodash'

const slowApiUri = process.env.REACT_APP_APIS_URI
const apiUri = process.env.REACT_APP_API_URI
const ciSlowApiUri = process.env.REACT_APP_CI_APIS_URI
const ciApiUri = process.env.REACT_APP_CI_API_URI

export const getCIEnabledPolicyFromRedux = () => {
  let state = {}
  if (window?.getStore && window.getStore().getState) {
    state = window.getStore().getState() || {}
  }
  const currentOrigin = window.location.origin
  const url = new URL(apiUri)
  const domain = url.origin
  const defaultCIEnabled = currentOrigin !== domain
  return get(
    state,
    'user.user.orgData.policies.district.ciEnabled',
    defaultCIEnabled
  )
}

export const getApiUri = (type = '') => {
  const isSlowApi = type === 'slowapi'
  const ciEnabled = getCIEnabledPolicyFromRedux()
  let validApiUri = isSlowApi ? slowApiUri : apiUri
  if (ciEnabled) {
    if (isSlowApi && ciSlowApiUri) {
      validApiUri = ciSlowApiUri
    }
    if (!isSlowApi && ciApiUri) {
      validApiUri = ciApiUri
    }
  }
  return validApiUri
}
