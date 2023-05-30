import API from './utils/API'

const api = new API()
let prefix = '/content'

const contentImport = (data) => {
  return api
    .callApi({
      url: `${prefix}/import`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

const contentImportProgress = (data) => {
  return api
    .callApi({
      url: `${prefix}/import-progress`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

const qtiImport = (data) => {
  prefix = 'qti'
  return api
    .callApi({
      url: `${prefix}/import`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

const qtiImportStatus = (jobId) => {
  prefix = 'qti'
  return api
    .callApi({
      url: `${prefix}/import/${jobId}`,
      method: 'get',
    })
    .then(({ data: response }) => response)
}

export default {
  contentImport,
  contentImportProgress,
  qtiImport,
  qtiImportStatus,
}
