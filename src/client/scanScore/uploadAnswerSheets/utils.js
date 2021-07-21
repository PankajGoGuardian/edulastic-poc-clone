import { FireBaseService as Fbs } from '@edulastic/common'

export const bubbleSheetsCollectionName = 'BubbleAnswerSheets'

export const processStatusMap = {
  in_progress: 2,
  done: 3,
  failed: 4,
  archived: 5,
  aborted: 6,
}

export const omrUploadSessionStatus = {
  0: 'Not Started',
  1: 'Uploaded',
  2: 'Scanning',
  3: 'Scored',
  4: 'Failed',
  5: 'Archived', // NOTE: use this for 'scan again' action
}

export const omrSheetScanStatus = { ...omrUploadSessionStatus }

export const statusFilterOptions = [
  { key: '', label: 'All' },
  { key: '2', label: omrUploadSessionStatus[2] },
  { key: '3', label: omrUploadSessionStatus[3] },
  { key: '4', label: omrUploadSessionStatus[4] },
]

export const getFileNameFromUri = (uri = '') => uri.split('/').lastItem

export const deleteNotificationDocuments = (docIds = []) => {
  const batch = Fbs.db.batch()
  docIds.forEach((d) => {
    const ref = Fbs.db.collection(bubbleSheetsCollectionName).doc(d.__id)
    batch.delete(ref)
  })
  batch.commit().catch((err) => console.error(err))
}
