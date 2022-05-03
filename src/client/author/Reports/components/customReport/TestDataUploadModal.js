import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon, Select, Spin } from 'antd'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { CustomModalStyled, FlexContainer, EduButton } from '@edulastic/common'
import {
  dashBorderColor,
  dragDropUploadText,
  greyThemeDark3,
  greyThemeLighter,
  themeColorBlue,
} from '@edulastic/colors'
import { IconUpload } from '@edulastic/icons'

import {
  uploadTestDataFileAction,
  getTestDataFileUploadLoader,
  getTestDataFileUploadResponse,
} from './ducks'

import dropdownData from './static/dropdownData.json'

const { Option } = Select

const TestDataUploadModal = ({
  uploadFile,
  isVisible,
  closeModal,
  loading,
  user,
  uploadResponse,
}) => {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')

  const handleFileUpload = () => {
    uploadFile({
      file,
      userId: `${user._id}`,
      districtId: `${user?.currentDistrictId || user.districtIds[0]}`,
      category,
    })
  }

  useEffect(() => {
    if (!isEmpty(uploadResponse)) {
      closeModal(true)
    }
  }, [uploadResponse])

  return (
    <CustomModalStyled
      visible={isVisible}
      maskClosable={false}
      title="Upload File"
      onCancel={() => {
        closeModal(false)
      }}
      centered
      footer={[
        <EduButton
          width="200px"
          isGhost
          key="cancelButton"
          onClick={() => {
            closeModal(false)
          }}
        >
          CANCEL
        </EduButton>,
        <EduButton
          btnType="primary"
          width="200px"
          onClick={() => handleFileUpload()}
          disabled={loading || isEmpty(file) || isEmpty(category)}
        >
          {loading ? <Spin /> : 'Upload'}
        </EduButton>,
      ]}
    >
      <Container>
        <Select
          placeholder="Select data format"
          style={{ width: 200 }}
          onChange={(e) => {
            setCategory(e)
          }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {dropdownData.dataFormatDropdownOptions.map(({ key, value }) => (
            <Option value={key}>{value}</Option>
          ))}
        </Select>
        <Dropzone
          maxSize="104857600"
          onDrop={([f]) => setFile(f)}
          accept=".csv, application/vnd.ms-excel, text/csv" // text/csv might not work for Windows based machines
          className="dropzone"
          activeClassName="active-dropzone"
          multiple={false}
          disabled={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <DropzoneContentContainer
                {...getRootProps()}
                className={`orders-dropzone ${
                  isDragActive ? 'orders-dropzone--active' : ''
                }`}
                isDragActive={isDragActive}
              >
                <input {...getInputProps()} />
                <FlexContainer
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconUpload />
                  <StyledText>Drag & Drop</StyledText>
                  <StyledText isComment>
                    {`or `}
                    <Underlined>browse</Underlined>
                    {` : CSV (100MB Max)`}
                  </StyledText>
                </FlexContainer>
              </DropzoneContentContainer>
            )
          }}
        </Dropzone>
        <FlexContainer alignItems="center" justifyContent="center">
          {file && (
            <>
              <Icon
                type="file-text"
                theme="filled"
                style={{ fill: greyThemeDark3, fontSize: '18px' }}
              />
              <StyledText style={{ color: greyThemeDark3, marginLeft: '10px' }}>
                {file.name}
              </StyledText>
            </>
          )}
        </FlexContainer>
      </Container>
    </CustomModalStyled>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getTestDataFileUploadLoader(state),
    user: state.user.user,
    uploadResponse: getTestDataFileUploadResponse(state),
  }),
  {
    uploadFile: uploadTestDataFileAction,
  }
)

export default compose(withConnect)(TestDataUploadModal)

const Container = styled.div`
  padding: 10px;
`

const DropzoneContentContainer = styled.div`
  margin: 20px 0;
  padding: 50px;
  border-radius: 2px;
  border: ${({ isDragActive }) =>
    isDragActive
      ? `2px solid ${themeColorBlue}`
      : `1px dashed ${dashBorderColor}`};
  background: ${greyThemeLighter};
  svg {
    margin-bottom: 12px;
    width: 35px;
    height: 30px;
    fill: ${({ isDragActive }) =>
      isDragActive ? themeColorBlue : dragDropUploadText};
  }
  &:hover {
    border: 1px dashed ${greyThemeDark3};
    svg {
      fill: ${greyThemeDark3};
    }
  }
`

const StyledText = styled.div`
  font-size: ${({ isComment }) => (isComment ? 11 : 14)}px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${dragDropUploadText};
  margin-top: ${({ isComment }) => (isComment ? 10 : 0)}px;
`

const Underlined = styled.span`
  color: ${themeColorBlue};
  cursor: pointer;
  text-decoration: underline;
`
