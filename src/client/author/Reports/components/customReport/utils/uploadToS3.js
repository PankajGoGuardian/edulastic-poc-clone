import { dataWarehouseApi, fileApi } from '@edulastic/api'
import { aws } from '@edulastic/constants'
import { isEmpty } from 'lodash'

const s3Folders = Object.values(aws.s3Folders)

/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async ({
  file,
  folder,
  subFolder,
  category,
  progressCallback,
  cancelUpload,
  versionYear,
  testName,
}) => {
  let logDetails = {}
  if (!file) {
    throw new Error('file is missing.')
  }
  if ((!folder || !s3Folders.includes(folder)) && !folder.includes('user/')) {
    throw new Error('folder is invalid.')
  }

  const { name = '' } = file

  if (isEmpty(name)) {
    throw new Error('Filename cannot be empty.')
  }

  const result = await dataWarehouseApi.getSignedUrl(
    name,
    category,
    versionYear,
    testName,
    folder,
    subFolder
  )
  const formData = new FormData()
  const { fields, url } = result
  logDetails = result.dataWarehouseLogsDetails

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
    const response = await fileApi.uploadBySignedUrl(
      url,
      formData,
      progressCallback,
      cancelUpload
    )
    return response
  } catch (e) {
    if (typeof e === 'object' && e.toString().toLowerCase() === 'cancel') {
      await dataWarehouseApi.updateDatawarehouseLogsStatus(logDetails._id, {
        status: 'ERROR',
        statusReason: 'File upload cancelled by the user.',
      })
      throw new Error('File upload cancelled.')
    }
    if (!isEmpty(logDetails)) {
      await dataWarehouseApi.updateDatawarehouseLogsStatus(logDetails._id, {
        status: 'ERROR',
        statusReason: e,
      })
      throw new Error('Error while uploading the file.')
    }
  }
}
