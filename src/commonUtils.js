import { get } from "lodash"

const slowApiUri = process.env.REACT_APP_APIS_URI
const apiUri = process.env.REACT_APP_API_URI
const ciSlowApiUri = process.env.REACT_APP_C_I_APIS_URI
const ciApiUri = process.env.REACT_APP_C_I_API_URI

export const getCIEnabledPolicyFromRedux = () => {
  let state = {}
  if(window?.getStore && window.getStore().getState){
    state = window.getStore().getState() || {}
  }
  return get(state, 'user.user.orgData.policies.district.ciEnabled', false)
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
