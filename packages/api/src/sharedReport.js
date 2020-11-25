import API from './utils/API'

const api = new API()
const prefix = '/shared-report'

/* TODO: check the API and change accordingly */
const createSharedReport = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

/* TODO: check the API and change accordingly */
const updateSharedReport = (data) =>
  api
    .callApi({
      url: `${prefix}/${data.id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

/* TODO: check the API and change accordingly */
const deleteSharedReport = ({ id }) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'delete',
    })
    .then((result) => result.data.result)

const getSharedReports = (params) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

export default {
  createSharedReport,
  updateSharedReport,
  deleteSharedReport,
  getSharedReports,
}
