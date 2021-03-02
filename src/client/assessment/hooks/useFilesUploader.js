/**
 * This hook is used for uploading a list of files with custom upload function.
 * It waits for all the files to uploaded and calls onUploadsFinishedCallback if provided.
 * It uses internally uuid for all files to be used in callbacks since indexes might changed on
 * file deletion by user.
 */

import { useState, useRef } from 'react'
import { isEmpty, isFunction } from 'lodash'
import uuidv4 from 'uuid'

export const UPLOAD_STATUS = {
  CANCELLED: 'upload status cancelled',
  FAILED: 'upload status failed',
  SUCCESS: 'upload status success',
  UPLOADING: 'upload status uploading',
}

const useFilesUploader = (
  uploadFile,
  validateFile,
  onUploadsFinishedCallback
) => {
  // Array of files to be uploaded, each file has unique uuid attached to it for reference
  const filesToUploadRef = useRef()
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)
  /* Mapping to storing file upload info. This is exposed to components using the hook
   * {
   *  [fileUuid]: {
   *     name: 'name',
   *     type: 'type',
   *     size: 'size'
   *     percent: <uploadDonePercent>,
   *     source: <url of uploaded file>,
   *     status: uploading|success|failed|cancelled|
   *  }
   * }
   */
  const [filesInfo, setFilesInfo] = useState({})
  // This is used to pass to any callback function since state can't be relied upon to have latest
  // changes due to batching.
  const filesInfoRef = useRef()

  const getValidFiles = (files) => {
    if (!validateFile || !isFunction(validateFile)) {
      return files
    }

    return files
      .filter((file) => validateFile(file))
      .map((file) => {
        // Generate uuid for file.
        file.uuid = uuidv4()
        return file
      })
  }

  const addFiles = (files) => {
    const validFiles = getValidFiles(files)
    filesToUploadRef.current = filesToUploadRef.current
      ? [...filesToUploadRef.current, ...validFiles]
      : [...validFiles]
    const newFilesInfo = filesToUploadRef.current.reduce(
      (acc, { name, type, size, uuid }) => {
        acc[uuid] = {
          name,
          type,
          size,
        }
        return acc
      },
      {}
    )
    filesInfoRef.current = { ...newFilesInfo }
    setFilesInfo(newFilesInfo)
  }

  const updateFilesInfo = (id, data) => {
    const newFilesInfo = {
      ...filesInfoRef.current,
      [id]: { ...filesInfoRef.current[id], ...data },
    }
    filesInfoRef.current = { ...newFilesInfo }
    setFilesInfo(newFilesInfo)
  }

  const onUploadStart = (id) =>
    updateFilesInfo(id, { status: UPLOAD_STATUS.UPLOADING })

  const onUploadsFinished = (isUploadsFinished) => {
    if (!isUploadsFinished) {
      return
    }

    // If this was the last file, run onAllUploadFinished callback
    if (isFunction(onUploadsFinishedCallback)) {
      onUploadsFinishedCallback([...Object.values(filesInfoRef.current)])
    }

    setIsUploadingFiles(false)
  }

  const onUploadSuccess = (id, index) => (uri) => {
    updateFilesInfo(id, { status: UPLOAD_STATUS.SUCCESS, source: uri })
    onUploadsFinished(index === filesToUploadRef.current.length - 1)
  }

  const onUploadFailed = (id, index, e) => {
    updateFilesInfo(id, { status: UPLOAD_STATUS.FAILED, error: e.message })
    onUploadsFinished(index === filesToUploadRef.current.length - 1)
  }

  const deleteFile = (index) => {
    if (!filesToUploadRef.current) {
      return
    }
    const file = filesToUploadRef.current[index]
    if (!file) {
      return
    }
    const idToDelete = file.uuid
    const cancel = filesInfo[idToDelete].cancel
    if (isFunction(cancel)) {
      cancel('Canceled By User')
    }

    filesToUploadRef.current = [
      ...filesToUploadRef.current.slice(0, index),
      ...filesToUploadRef.current.slice(index + 1),
    ]
    const newFilesInfo = Object.keys(filesInfo).reduce((acc, key) => {
      if (key !== idToDelete) {
        acc[key] = filesInfo[key]
      }
      return acc
    }, {})
    filesInfoRef.current = { ...newFilesInfo }
    setFilesInfo(newFilesInfo)
  }

  const onProgress = (id) => (e) =>
    updateFilesInfo(id, { percent: Math.round((e.loaded * 100) / e.total) })

  const setCancelUploadFn = (id) => (fn) => updateFilesInfo(id, { cancel: fn })

  const resetFiles = () => {
    setFilesInfo({})
    filesToUploadRef.current = []
  }

  const uploadFiles = () => {
    if (!filesToUploadRef.current || isEmpty(filesToUploadRef.current)) {
      return
    }
    setIsUploadingFiles(true)
    filesToUploadRef.current.forEach((file, i) => {
      if (UPLOAD_STATUS.CANCELLED !== file.status) {
        const id = file.uuid
        onUploadStart(id)
        try {
          uploadFile(
            file,
            validateFile,
            onProgress(id),
            setCancelUploadFn(id),
            onUploadSuccess(id, i)
          )
        } catch (e) {
          onUploadFailed(id, i, e)
        }
      }
    })
  }

  return {
    filesInfo,
    isUploadingFiles,
    addFiles,
    uploadFiles,
    deleteFile,
    resetFiles,
    UPLOAD_STATUS,
  }
}

export default useFilesUploader
