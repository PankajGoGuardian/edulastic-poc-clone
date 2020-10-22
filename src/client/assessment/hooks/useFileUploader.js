/**
 * This hook is used for uploading an image to user S3 folder.
 * It accepts callback to be run after getting url for uploaded image.
 */

import { useState, useRef } from 'react'
import { notification } from '@edulastic/common'

const useFileUploader = (uploadFile, validateFile, onUploadsFinished) => {
  const [filesToUpload, setFilesToUpload] = useState([])
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)
  const stateUpdateHelperRef = useRef()
  const UPLOAD_STATUS_CANCELLED = 'upload status cancelled'
  const UPLOAD_STATUS_FAILED = 'upload status failed'
  const UPLOAD_STATUS_SUCCESS = 'upload status success'
  const UPLOAD_STATUS_UPLOADING = 'upload status uploading'

  const addFileToUpload = (file) => {
    const newFilesToUpload = [...filesToUpload, file]
    stateUpdateHelperRef.current = newFilesToUpload
    setFilesToUpload(newFilesToUpload)
  }

  const onUploadSuccess = (index) => (uri) => {
    if (stateUpdateHelperRef.current) {
      stateUpdateHelperRef.current[index].status = UPLOAD_STATUS_SUCCESS
      stateUpdateHelperRef.current[index].source = uri
      setFilesToUpload(newFilesToUpload)
    }

    checkAndCallOnUploadsFinished(index)
  }

  const onUploadFailed = (index) => (e) => {
    if (stateUpdateHelperRef.current) {
      stateUpdateHelperRef.current[index].status = UPLOAD_STATUS_FAILED
      stateUpdateHelperRef.current[index].error = e.message
      setFilesToUpload([...stateUpdateHelperRef.current])
    }

    onUploadsFinished(index)
  }

  const onUploadsFinished = (isUploadsFinished) => {
    if (!isUploadsFinished) {
      return
    }

    // If this was the last file, run onAllUploadFinished callback
    if (typeof onUploadsFinishedCallback === 'function' && index === filesToUpload.length - 1) {
      onUploadsFinishedCallback([...filesToUpload]);
      setIsUploadingFiles(false)
    }
  }

  const onCancelUpload = (index) => {
    if (stateUpdateHelperRef.current) {
      const { cancel } = stateUpdateHelperRef.current[index]
      if (typeof cancel === 'function') {
        cancel('Canceled By User')
      }
      stateUpdateHelperRef.current[index].status = UPLOAD_STATUS_CANCELLED
      setFilesToUpload([...stateUpdateHelperRef.current])
    }
  }

  const onProgress = (index) => (e) => {
    if (stateUpdateHelperRef.current) {
      const percent = Math.round((e.loaded * 100) / e.total)
      stateUpdateHelperRef.current[index].percent = percent
      setFilesToUpload([...stateUpdateHelperRef.current])
    }
  }

  const setCancelUploadFn = (index) => (fn) => {
    if (stateUpdateHelperRef.current) {
      stateUpdateHelperRef.current[index].cancel = fn
    }
  }

  const resetFilesToUpload = () => {
    stateUpdateHelperRef.current = []
    setFilesToUpload([])
  }

  const uploadFiles = () => {
    setIsUploadingFiles(true)
    filesToUpload.forEach((file, i) => {
      if (UPLOAD_STATUS_CANCELLED !== file.status) {
        try {
          uploadFile(
            file,
            onProgress(i),
            setCancelUploadFn(i),
            validateFile,
            onUploadSuccess(i)
          )
        } catch (e) {
          console.log(e)
        }
      }
    })
  }

  const uploadProgressArray = filesToUpload
    .filter((file) => file.status !== UPLOAD_STATUS_CANCELLED)
    .map(({ uid, type, name, size, percent, source }) => {
      return { uid, type, name, size, percent, source }
    })
  }

  return [isFileUploading, uploadFile]
}

export default useFileUpload
