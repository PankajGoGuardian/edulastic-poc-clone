import React from 'react'
import { Upload } from 'antd'

import { notification, beforeUpload } from '@edulastic/common'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import { aws } from '@edulastic/constants'

import { uploadToS3 } from '../../../../author/src/utils/upload'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'

export default function AddBackgroundImage({ t, title, setImageDimensions }) {
  const handleChange = async (info) => {
    try {
      const { file } = info
      if (!file.type.match(/image/g)) {
        notification({ messageKey: 'pleaseUploadFileInImageFormat' })
        return
      }
      const canUpload = beforeUpload(file)
      if (!canUpload) {
        return
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT)
      console.log('image URL', imageUrl)
      setImageDimensions(imageUrl, true)

      notification({
        type: 'success',
        msg: `${info.file.name} ${t(
          'component.cloze.imageText.fileUploadedSuccessfully'
        )}.`,
      })
    } catch (e) {
      console.log(e)
      notification({
        msg: `${info.file.name} ${t(
          'component.cloze.imageText.fileUploadFailed'
        )}.`,
      })
    }
  }

  const uploadProps = {
    beforeUpload: () => false,
    onChange: handleChange,
    accept: 'image/*',
    multiple: false,
    showUploadList: false,
  }

  return (
    <Upload {...uploadProps}>
      <CustomStyleBtn
        width="180px"
        id={getFormattedAttrId(
          `${title}-${t('component.classification.addBackImage')}`
        )}
      >
        {t('component.classification.addBackImage')}
      </CustomStyleBtn>
    </Upload>
  )
}
