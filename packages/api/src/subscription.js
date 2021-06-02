import API from './utils/API'

const api = new API()
const prefix = '/subscription'

const upgradeUsingLicenseKey = (licenseKey) =>
  api
    .callApi({
      url: `${prefix}/license/use`,
      method: 'put',
      data: { license: licenseKey },
    })
    .then((result) => result.data.result)

const subscriptionStatus = () =>
  api
    .callApi({
      url: `${prefix}/me`,
      method: 'get',
    })
    .then((result) => result.data)

const extendTrialLicense = (data) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/extend-trial`,
      data,
    })
    .then((result) => result.data)

const fetchProducts = (data) =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}/products`,
      params: data,
    })
    .then((result) => result.data.result)

const requestInvoice = (data) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/request-invoice`,
      data,
    })
    .then((result) => result.data)

const submitPO = (data) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/purchase-orders`,
      data,
    })
    .then((result) => result.data)

export default {
  upgradeUsingLicenseKey,
  subscriptionStatus,
  extendTrialLicense,
  fetchProducts,
  requestInvoice,
  submitPO,
}
