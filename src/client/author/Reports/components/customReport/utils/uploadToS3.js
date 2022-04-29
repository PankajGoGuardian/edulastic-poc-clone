import { dataWarehouseApi, fileApi } from '@edulastic/api'
import { aws } from '@edulastic/constants'
import { getStore } from '../../../../../configureStore'
import { fetchUploadsStatusList, GET_UPLOADS_STATUS_LIST_REQUEST } from '../ducks'

const s3Folders = Object.values(aws.s3Folders)

const getCleanLowerCaseString = (str) => str.trim().toLowerCase()
/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async (
  file,
  folder,
  subFolder,
  fileCategory,
  districtId,
  progressCallback,
  cancelUpload
) => {
  if (!file) {
    throw new Error('file is missing')
  }
  if ((!folder || !s3Folders.includes(folder)) && !folder.includes('user/')) {
    throw new Error('folder is invalid')
  }

  /**
   * @see EV-30181 | EV-29279
   * remove special characters from file name before uploading
   */
  const { name: fileName = '' } = file
  const fileParts = fileName.split('.')[0].split('__')
  if (fileParts.length !== 4) {
    throw new Error('Invalid file name.')
  }

  if (
    getCleanLowerCaseString(fileParts[1]) !==
    getCleanLowerCaseString(fileCategory)
  ) {
    throw new Error('File category do not match with the selected format.')
  }
  if (
    getCleanLowerCaseString(fileParts[3]) !==
    getCleanLowerCaseString(`${districtId}`)
  ) {
    throw new Error(
      `District id for the file does not matches with user's district id.`
    )
  }

  const result = await dataWarehouseApi.getSignedUrl(
    fileName,
    folder,
    subFolder
  )
  const formData = new FormData()
  const { fields, url, cdnUrl, logDetails } = result

  Object.keys(fields).forEach((item) => {
    formData.append(item, fields[item])
  })

  formData.append('file', file)

  if (!progressCallback) {
    progressCallback = () => {}
  }
  if (!cancelUpload) {
    cancelUpload = () => {}
  }
  try {
    await fileApi.uploadBySignedUrl(
      url,
      formData,
      progressCallback,
      cancelUpload
    )
    getStore().dispatch({ type: GET_UPLOADS_STATUS_LIST_REQUEST })
  } catch (e) {
    await dataWarehouseApi.updateLogStatus(logDetails._id, {
      status: 'ERROR',
    })
    throw new Error('Error while uploading the file.')
  }

  return `${cdnUrl}/${fields.key}`
}
