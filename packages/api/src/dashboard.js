import API from './utils/API'

const api = new API()
const prefix = '/dashboard'

/*
 * api for fetching dashboard details
 */
const getTeacherDashboardDetails = (filterType) => {
  return api
    .callApi({
      url: `${prefix}/teacher${filterType ? `?filterType=${filterType}` : ''}`,
      method: 'get',
    })
    .then((result) => result.data.result)
}

const toggleFavouriteClass = (payload) =>
  api
    .callApi({
      url: `${prefix}/toggle-favourite`,
      method: 'post',
      data: payload,
    })
    .then(({ data }) => data.result)

export default {
  getTeacherDashboardDetails,
  toggleFavouriteClass,
}
