import { FireBaseService as Fbs } from '@edulastic/common'

export const bubbleSheetsCollectionName = 'BubbleAnswerSheets'

export const omrUploadSessionStatus = {
  NOT_STARTED: 0,
  UPLOADED: 1,
  SCANNING: 2,
  DONE: 3,
  FAILED: 4,
  ARCHIVED: 5,
  ABORTED: 6,
}

export const omrSheetScanStatus = { ...omrUploadSessionStatus }

export const omrUploadSessionStatusMapping = {
  0: 'Not Started',
  1: 'Uploaded',
  2: 'Scanning',
  3: 'Scored',
  4: 'Failed',
  5: 'Archived',
  6: 'Aborted',
}

export const omrSheetScanStatusMapping = { ...omrUploadSessionStatusMapping }

export const processStatusMapping = {
  in_progress: omrUploadSessionStatus.SCANNING,
  done: omrUploadSessionStatus.DONE,
  failed: omrUploadSessionStatus.FAILED,
  archived: omrUploadSessionStatus.ARCHIVED,
  aborted: omrUploadSessionStatus.ABORTED,
}

export const statusFilterOptions = [
  { key: '', label: 'All' },
  {
    key: String(omrUploadSessionStatus.SCANNING),
    label: omrUploadSessionStatus[omrUploadSessionStatus.SCANNING],
  },
  {
    key: String(omrUploadSessionStatus.DONE),
    label: omrUploadSessionStatus[omrUploadSessionStatus.DONE],
  },
  {
    key: String(omrUploadSessionStatus.FAILED),
    label: omrUploadSessionStatus[omrUploadSessionStatus.FAILED],
  },
]

export const deleteNotificationDocuments = (docIds = []) => {
  const batch = Fbs.db.batch()
  docIds.forEach((docId) => {
    const ref = Fbs.db.collection(bubbleSheetsCollectionName).doc(docId)
    batch.delete(ref)
  })
  batch.commit().catch((err) => console.error(err))
}

export const getFileNameFromUri = (uri = '') => uri.split('/').lastItem

export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return ''
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
