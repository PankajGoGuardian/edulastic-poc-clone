import API from './utils/API'

const api = new API()

const contentImport = (data) => {
  return api
    .callApi({
      url: `content/import`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

const contentImportProgress = (data) => {
  return api
    .callApi({
      url: `content/import-progress`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

const qtiImport = (data) => {
  return api
    .callApi({
      url: `qti/import`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

const qtiImportStatus = (jobId) => {
  return api
    .callApi({
      url: `qti/import/${jobId}`,
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
