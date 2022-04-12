import React, { useRef } from 'react'
import { connect } from 'react-redux'
import {
  EduSwitchStyled,
  EduButton,
  FlexContainer,
  PortalSpinner,
  FileIcon,
  formatFileSize,
} from '@edulastic/common'
import { SettingContainer } from '../../../../../AssignTest/components/Container/styled'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import { setTestDataAction } from '../../../../ducks'
import { useRefMaterialFile } from '../../../../../Shared/Hooks/useRefMaterialFile'
import {
  Body,
  Description,
  Title,
  NormalText,
  UploadInput,
  FileName,
  CloseIcon,
} from './styled'

const ReferenceMaterial = ({
  owner,
  premium,
  isEditable,
  isSmallSize,
  setTestData,
  referenceDocAttributes,
}) => {
  const inputRef = useRef()

  const updateTestData = (value) => {
    setTestData({ referenceDocAttributes: value })
  }

  const [
    hasRefMaterial,
    enableUpload,
    isUploading,
    allowedFiles,
    onChangeSwitch,
    onRemoveFile,
    onChangeFile,
  ] = useRefMaterialFile(referenceDocAttributes, updateTestData)

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
      onChangeFile(fileToUpload)
    }
  }

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
          onChange={onChangeSwitch}
        />
      </Title>
      <Body smallSize={isSmallSize}>
        <Description>
          Upload Reference materials like formula sheet, periodic table,
          constant value sheets etc to help students in solving the questions.
        </Description>
      </Body>
      {!hasRefMaterial && enableUpload && premium && (
        <FlexContainer justifyContent="flex-start" alignItems="center">
          <EduButton height="28px" mr="24px" onClick={handleChooseFile}>
            UPLOAD FILE
          </EduButton>
          <NormalText>PNG, JPG, PDF (Max 2MB)</NormalText>
        </FlexContainer>
      )}
      {hasRefMaterial && (
        <FlexContainer justifyContent="flex-start" alignItems="center">
          <FileIcon type={referenceDocAttributes?.type} />
          <FileName>{referenceDocAttributes.name}</FileName>
          <NormalText>{formatFileSize(referenceDocAttributes.size)}</NormalText>
          <CloseIcon
            width={12}
            height={12}
            role="presentation"
            onClick={onRemoveFile}
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
