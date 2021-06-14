import API from './utils/API'

const api = new API()
const prefix = '/shared-report'

const createSharedReport = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateSharedReport = ({ id, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const archiveSharedReport = ({ id }) =>
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
  archiveSharedReport,
  getSharedReports,
}
