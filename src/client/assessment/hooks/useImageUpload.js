/**
 * This hook is used for uploading an image to user S3 folder.
 * It accepts callback to be run after getting url for uploaded image.
 */

import { useState } from 'react'
import { aws } from '@edulastic/constants'
import { beforeUpload, notification } from '@edulastic/common'
import { uploadToS3 } from '@edulastic/common/src/helpers'

const useImageUpload = (postUpload, userId) => {
  const [isImageUploading, setIsImageUploading] = useState(false)

  const uploadImage = async (imageBlob) => {
    try {
      setIsImageUploading(true)

      // Validate image type.
      if (!imageBlob.type.match(/image/g)) {
        notification({ messageKey: 'pleaseUploadFileInImageFormat' })
        setIsImageUploading(false)
        return
      }

      // Validate image size.
      if (!beforeUpload(imageBlob)) {
        setIsImageUploading(false)
        return
      }

      // Try to upload the image.
      const imageUrl = await uploadToS3(
        imageBlob,
        `${aws.s3Folders.USER}`,
        `${userId}`
      )

      // Run any postUpload callback with resulting url.
      if (typeof postUpload === 'function') {
        postUpload(imageUrl)
      }
      setIsImageUploading(false)
    } catch (e) {
      notification({ messageKey: 'imageUploadErr' })
      setIsImageUploading(false)
      console.log(e)
    }
  }

  return [isImageUploading, uploadImage]
}

export default useImageUpload
