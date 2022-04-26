import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { notification, uploadToS3 } from '@edulastic/common'
import { aws, fileTypes } from '@edulastic/constants'

const folder = aws.s3Folders.DEFAULT

const allowedFiles = [
  fileTypes.PDF,
  fileTypes.PNG,
  fileTypes.JPEG,
  fileTypes.JPG,
]

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
// const reference = {
//   name: 'bird.png',
//   size: 532360,
//   source: 'file path',
//   type: 'image/png',
// }

export const useRefMaterialFile = (referenceDocAttributes, setData) => {
  const [enableUpload, setEnableUpload] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleRemoveRefMaterial = () => {
    if (typeof setData === 'function') {
      setData({})
      setEnableUpload(false)
    }
  }

  const handleChangeRefMaterial = (checked) => {
    setEnableUpload(checked)
    if (!checked && typeof setData === 'function') {
      setData({})
    }
  }

  const handleChangeFile = async (file) => {
    try {
      const { name, size, type } = file
      if (!allowedFiles.includes(type)) {
        notification({ messageKey: 'fileTypeErr' })
        return
      }
      if (size > MAX_SIZE) {
        notification({ messageKey: 'imageSizeError' })
        return
      }
      setIsUploading(true)
      const uri = await uploadToS3(file, folder)
      if (typeof setData === 'function') {
        setData({ name, size, source: uri, type })
      }
    } catch (error) {
      console.log(error)
    }
    setIsUploading(false)
  }

  const hasRefMaterial = !isEmpty(referenceDocAttributes)
  useEffect(() => {
    if (hasRefMaterial) {
      setEnableUpload(true)
    }
  }, [hasRefMaterial])

  return [
    hasRefMaterial,
    enableUpload,
    isUploading,
    allowedFiles,
    handleChangeRefMaterial,
    handleRemoveRefMaterial,
    handleChangeFile,
  ]
}
