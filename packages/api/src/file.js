import axios from 'axios'
import API from './utils/API'

const api = new API()
const { CancelToken } = axios
const prefix = '/file'

const upload = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)

  return api
    .callApi({
      url: `${prefix}/upload`,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((result) => result.data.result)
}

const getSignedUrl = (filename, folder, subFolder, type) =>
  api
    .callApi({
      url: `${prefix}/signed-url`,
      method: 'get',
      params: {
        filename,
        subFolder,
        folder,
        type,
      },
    })
    .then((result) => result.data.result)

const uploadFromDrive = ({ token, id, name, folderName, ...otherData }) =>
  api
    .callApi({
      url: `${prefix}/uploadFromDrive`,
      method: 'post',
      data: { token, id, name, folderName, ...otherData },
    })
    .then((result) => result.data)

const uploadBySignedUrl = (url, data, progressCallback, cancelUpload) =>
  axios({
    method: 'post',
    url,
    data,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onUploadProgress: progressCallback,
    cancelToken: new CancelToken((_cancel) => {
      if (cancelUpload) {
        cancelUpload(_cancel)
      }
    }),
  })

export default {
  upload,
  getSignedUrl,
  uploadBySignedUrl,
  uploadFromDrive,
}
