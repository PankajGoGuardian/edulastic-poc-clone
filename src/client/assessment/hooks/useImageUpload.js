/**
 * this is used to calculate dimensions of image if any inside a html template
 * input {string}
 * output {object} containing height and width of image
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
