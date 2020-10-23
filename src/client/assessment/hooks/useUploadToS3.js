/**
 * This hook is used for uploading an image to user S3 folder.
 * It accepts callback to be run after getting url for uploaded image.
 */

import { useState } from 'react'
import { aws } from '@edulastic/constants'
import { notification } from '@edulastic/common'
import { uploadToS3 } from '../../author/src/utils/upload'

const useFileUpload = (userId) => {
  const [isFileUploading, setIsFileUploading] = useState(false)

  const uploadFile = async (
    file,
    validateFile,
    progressCallback,
    cancelCallback,
    postUploadCallback
  ) => {
    try {
      setIsFileUploading(true)

      // Validate file to upload.
      if (
        validateFile &&
        typeof validateFile === 'function' &&
        !validateFile(file)
      ) {
        setIsFileUploading(false)
        return
      }

      const url = await uploadToS3(
        file,
        `${aws.s3Folders.USER}`,
        `${userId}`,
        progressCallback,
        cancelCallback
      )

      // Run any postUploadCallback with resulting url.
      if (typeof postUploadCallback === 'function') {
        postUploadCallback(url)
      }
      setIsFileUploading(false)
    } catch (e) {
      notification({ messageKey: 'uploadFailed' })
      setIsFileUploading(false)
      console.log(e)
    }
  }

  return [isFileUploading, uploadFile]
}

export default useFileUpload
