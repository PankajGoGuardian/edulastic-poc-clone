import { dataWarehouseApi, fileApi } from '@edulastic/api'
import { aws } from '@edulastic/constants'
import { isEmpty } from 'lodash'
import { dwLogStatus } from '../Reports/components/dataWarehouseReport/importHistory/utils'

const s3Folders = Object.values(aws.s3Folders)

/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async ({
  file,
  folder,
  subFolder,
  feedType,
  progressCallback,
  cancelUpload,
  termId,
  feedName,
  testDate,
  versionYear,
  feedId,
  _id,
}) => {
  if (!file) {
    throw new Error('File is missing.')
  }
  if ((!folder || !s3Folders.includes(folder)) && !folder.includes('user/')) {
    throw new Error('Folder is invalid.')
  }

  const { name = '' } = file

  if (isEmpty(name)) {
    throw new Error('Filename cannot be empty.')
  }

  const result = await dataWarehouseApi.getSignedUrl({
    filename: name,
    feedType,
    versionYear,
    termId,
    feedName,
    testDate,
    folder,
    subFolder,
    feedId,
    _id,
  })

  const formData = new FormData()
  const { fields, url, dataWarehouseLog } = result

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
    const uploadResponse = await fileApi.uploadBySignedUrl(
      url,
      formData,
      progressCallback,
      cancelUpload
    )
    return {
      uploadResponse,
      uploadLog: dataWarehouseLog,
    }
  } catch (e) {
    const status = dwLogStatus.FAILED
    let statusReason = ''
    let errMessage = e.message
    if (typeof e === 'object' && e.toString().toLowerCase() === 'cancel') {
      statusReason = 'File upload cancelled by the user.'
      errMessage = 'File upload cancelled.'
    }
    if (dataWarehouseLog._id) {
      await dataWarehouseApi.updateDatawarehouseLogsStatus(
        dataWarehouseLog._id,
        {
          status,
          statusReason,
        }
      )
    }
    throw new Error(errMessage)
  }
}
