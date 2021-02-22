import API from './utils/API'

const api = new API()
const BASE_URL = '/payment'
const pay = (data) =>
  api
    .callApi({
      method: 'post',
      url: `${BASE_URL}/teacher`,
      data,
    })
    .then((result) => result.data)

const licensePurchase = (data) =>
  api
    .callApi({
      method: 'post',
      url: `${BASE_URL}/license-purchase`,
      data,
    })
    .then((result) => result.data)
export default {
  pay,
  licensePurchase,
}
