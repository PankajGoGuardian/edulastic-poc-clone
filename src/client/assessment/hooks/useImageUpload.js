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
    progressCallback,
    cancelCallback,
    validate,
    postUploadCallback
  ) => {
    try {
      setIsFileUploading(true)

      // Validate file to upload.
      if (validate && typeof validate === 'function' && !validate(file)) {
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
      if (typeof postUpload === 'function') {
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
