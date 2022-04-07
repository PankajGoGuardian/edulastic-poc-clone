import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { aws, fileTypes } from '@edulastic/constants'
import {
  EduSwitchStyled,
  EduButton,
  FlexContainer,
  notification,
  uploadToS3,
  PortalSpinner,
  FileIcon,
  formatFileSize,
} from '@edulastic/common'
import { SettingContainer } from '../../../../../AssignTest/components/Container/styled'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import { setTestDataAction } from '../../../../ducks'
import {
  Body,
  Description,
  Title,
  NormalText,
  UploadInput,
  FileName,
  CloseIcon,
} from './styled'

const allowedFiles = [
  fileTypes.PDF,
  fileTypes.PNG,
  fileTypes.JPEG,
  fileTypes.JPG,
]

const folder = aws.s3Folders.DEFAULT

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

// const reference = {
//   name: 'bird.png',
//   size: 532360,
//   source:
//     'https://s3.amazonaws.com/edureact-dev/default/bird_e3dee757-940a-4b09-b583-88405fc09270.png',
//   type: 'image/png',
// }
const ReferenceMaterial = ({
  owner,
  premium,
  isEditable,
  isSmallSize,
  setTestData,
  referenceDocAttributes,
}) => {
  const inputRef = useRef()
  const [enableUpload, setEnableUpload] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const hasReference = !isEmpty(referenceDocAttributes)

  const updateReferenceMaterial = (checked) => {
    setEnableUpload(checked)
    if (!checked) {
      setTestData({ referenceDocAttributes: {} })
    }
  }

  const handleUploadFile = async (file) => {
    setIsUploading(true)
    try {
      const uri = await uploadToS3(file, folder)
      const { name, size, type } = file
      setTestData({ referenceDocAttributes: { name, size, source: uri, type } })
    } catch (error) {
      console.log(error)
    }
    setIsUploading(false)
  }

  const handleChooseFile = (evt) => {
    if (inputRef.current) {
      inputRef.current.click()
      evt.target.blur()
    }
  }

  const handleChangeFile = (evt) => {
    const { files } = evt.target
    const fileToUpload = files[0]
    inputRef.current.value = ''

    if (fileToUpload) {
      const { size } = fileToUpload
      if (size > MAX_SIZE) {
        notification({ messageKey: 'imageSizeError' })
        return
      }
      handleUploadFile(fileToUpload)
    }
  }

  const removeFile = () => {
    setTestData({ referenceDocAttributes: {} })
  }

  useEffect(() => {
    if (hasReference) {
      setEnableUpload(true)
    }
  }, [hasReference])

  return (
    <SettingContainer>
      <Title>
        <span>
          Reference Material <DollarPremiumSymbol premium={premium} />
        </span>
        <EduSwitchStyled
          disabled={!owner || !isEditable || !premium}
          checked={enableUpload}
          data-cy="assignment-referenceDocAttributes-switch"
          onChange={updateReferenceMaterial}
        />
      </Title>
      <Body smallSize={isSmallSize}>
        <Description>
          Upload Reference materials like formula sheet, periodic table,
          constant value sheets etc to help students in solving the questions.
        </Description>
      </Body>
      {!hasReference && enableUpload && premium && (
        <FlexContainer justifyContent="flex-start" alignItems="center">
          <EduButton height="28px" mr="24px" onClick={handleChooseFile}>
            UPLOAD FILE
          </EduButton>
          <NormalText>PNG, JPG, PDF (Max 2MB)</NormalText>
        </FlexContainer>
      )}
      {hasReference && (
        <FlexContainer justifyContent="flex-start" alignItems="center">
          <FileIcon type={referenceDocAttributes?.type} />
          <FileName>{referenceDocAttributes.name}</FileName>
          <NormalText>{formatFileSize(referenceDocAttributes.size)}</NormalText>
          <CloseIcon
            width={12}
            height={12}
            role="presentation"
            onClick={removeFile}
          />
        </FlexContainer>
      )}
      <UploadInput
        multiple
        type="file"
        ref={inputRef}
        onChange={handleChangeFile}
        accept={allowedFiles.join()}
      />
      {isUploading && <PortalSpinner />}
    </SettingContainer>
  )
}

export default connect(null, {
  setTestData: setTestDataAction,
})(ReferenceMaterial)
