import React, { useRef } from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import {
  FlexContainer,
  FileIcon,
  formatFileSize,
  PortalSpinner,
  EduButton,
} from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { themeColor, cardTitleColor, linkColor1 } from '@edulastic/colors'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'
import { AlignSwitchRight, Label, StyledRow } from '../SimpleOptions/styled'
import { useRefMaterialFile } from '../../../Shared/Hooks/useRefMaterialFile'

const RefMaterialFile = ({
  premium,
  tootltipWidth,
  overRideSettings,
  attributes,
  disabled,
  hasRefMaterialAttributes,
}) => {
  const inputRef = useRef()

  const updateSetting = (value) => {
    overRideSettings('referenceDocAttributes', value)
  }

  const [
    hasRefMaterial,
    enableUpload,
    isUploading,
    allowedFiles,
    onChangeSwitch,
    onRemoveFile,
    onChangeFile,
  ] = useRefMaterialFile(attributes, updateSetting)

  const handleChangeFile = (evt) => {
    const { files } = evt.target
    const fileToUpload = files[0]
    inputRef.current.value = ''

    if (fileToUpload) {
      onChangeFile(fileToUpload)
    }
  }

  const handleChooseFile = (evt) => {
    if (inputRef.current) {
      inputRef.current.click()
      evt.target.blur()
    }
  }

  return (
    <SettingContainer id="reference-material">
      <DetailsTooltip
        width={tootltipWidth}
        title="Reference Material"
        content="Upload Reference materials like formula sheet, periodic table, constant value sheets etc to help students in solving the questions."
        premium={premium}
      />
      <StyledRow gutter={16} mb="15px">
        <Col span={10}>
          <Label>
            Reference Material
            <DollarPremiumSymbol premium={premium} />
          </Label>
        </Col>
        <Col span={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <AlignSwitchRight
              data-cy="reference-material-switch"
              size="small"
              disabled={!hasRefMaterialAttributes || disabled}
              defaultChecked={false}
              checked={enableUpload}
              onChange={onChangeSwitch}
            />
          </Row>
          {hasRefMaterial && (
            <FlexContainer
              mt="15px"
              justifyContent="flex-start"
              alignItems="center"
            >
              <FileIcon type={attributes?.type} />
              <FileName>{attributes.name}</FileName>
              <NormalText>{formatFileSize(attributes.size)}</NormalText>
              {!disabled && (
                <CloseIcon
                  width={12}
                  height={12}
                  role="presentation"
                  onClick={onRemoveFile}
                />
              )}
            </FlexContainer>
          )}
          {!hasRefMaterial && enableUpload && premium && (
            <FlexContainer
              justifyContent="flex-start"
              alignItems="center"
              mt="15px"
            >
              <EduButton
                height="28px"
                ml="0px"
                mr="24px"
                onClick={handleChooseFile}
              >
                UPLOAD FILE
              </EduButton>
              <NormalText>PNG, JPG, PDF (Max 2MB)</NormalText>
            </FlexContainer>
          )}
          {enableUpload && (
            <UploadInput
              multiple
              type="file"
              onChange={handleChangeFile}
              ref={inputRef}
              accept={allowedFiles.join()}
            />
          )}
          {isUploading && <PortalSpinner />}
        </Col>
      </StyledRow>
    </SettingContainer>
  )
}

export default RefMaterialFile

const CloseIcon = styled(IconClose)`
  fill: ${linkColor1};
  margin-left: 24px;
`

const FileName = styled.span`
  color: ${themeColor};
  font-size: 13px;
  font-weight: 600;
  margin: 0px 24px;
`

const NormalText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${cardTitleColor};
`

const UploadInput = styled.input`
  display: none;
`
