import API from './utils/API'

const api = new API()
const prefix = '/content'

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
const validateContent = (data) => {
  return api
    .callApi({
      url: `public/qti-validate`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)
}

export default {
  contentImport,
  contentImportProgress,
  validateContent,
}
