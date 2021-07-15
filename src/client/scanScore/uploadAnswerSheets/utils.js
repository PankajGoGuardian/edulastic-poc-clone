export const processStatusMap = {
  in_progress: 2,
  done: 3,
  failed: 4,
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

export const getFileNameFromUri = (uri = '') => uri.split('/').lastItem
