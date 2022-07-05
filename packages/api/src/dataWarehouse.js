import API from './utils/API'

const api = new API()
const prefix = '/data-warehouse'

const getSignedUrl = (
  filename,
  category,
  versionYear,
  testName,
  folder,
  subFolder
) =>
  api
    .callApi({
      url: `${prefix}/signed-url`,
      method: 'get',
      params: {
        filename,
        category,
        versionYear,
        testName,
        subFolder,
        folder,
      },
    })
    .then((result) => result.data.result)

const getDataWarehouseLogs = () =>
  api
    .callApi({
      url: prefix,
      method: 'get',
    })
    .then((result) => result.data.result)

const updateDatawarehouseLogsStatus = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}/status`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

export default {
  getSignedUrl,
  getDataWarehouseLogs,
  updateDatawarehouseLogsStatus,
}
