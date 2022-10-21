import React, { useState, useEffect, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon, Select, Spin, Input, Row, Col, Progress } from 'antd'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'

import {
  CustomModalStyled,
  FlexContainer,
  EduButton,
  notification,
} from '@edulastic/common'
import { testTypes as testTypesConstants } from '@edulastic/constants'
import {
  dashBorderColor,
  dragDropUploadText,
  greyThemeDark3,
  greyThemeLighter,
  themeColorBlue,
  borderGrey,
} from '@edulastic/colors'
import { IconUpload } from '@edulastic/icons'

import {
  uploadTestDataFileAction,
  getTestDataFileUploadLoader,
  getTestDataFileUploadResponse,
  getUpdateUploadProgressAction,
  getFileUploadProgress,
  getSetCancelUploadAction,
  getAbortUploadAction,
} from '../../../sharedDucks/dataWarehouse'

const { EXTERNAL_TEST_TYPES } = testTypesConstants

const MAX_FILE_SIZE = 30000000

const { Option } = Select

const DataWarehouseUploadModal = ({
  uploadFile,
  isVisible,
  closeModal,
  loading,
  uploadResponse,
  handleUploadProgress,
  uploadProgress,
  setCancelUpload,
  abortUpload,
}) => {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [testName, setTestName] = useState('')
  const [versionYear, setVersionYear] = useState('')
  const [yearDropdownOptions, setYearDropdownOptions] = useState([])

  const handleFileUpload = () => {
    uploadFile({
      file,
      category,
      handleUploadProgress,
      setCancelUpload,
      versionYear,
      testName,
    })
  }

  const cancelFileUpload = () => {
    abortUpload()
  }

  useEffect(() => {
    if (!isEmpty(uploadResponse)) {
      closeModal(true)
    }
  }, [uploadResponse])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearOptions = []
    for (let i = 0; i < 5; i++) {
      yearOptions.push({
        key: currentYear - i,
        value: currentYear - i,
      })
    }
    setYearDropdownOptions(yearOptions)
  }, [])

  const isUploadBtnDisabled = useMemo(
    () =>
      loading ||
      isEmpty(file) ||
      isEmpty(category) ||
      isEmpty(testName) ||
      isEmpty(`${versionYear}`),
    [loading, file, category, testName, versionYear]
  )

  return (
    <Modal
      modalWidth="800px"
      style={{ height: '800px' }}
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
          onClick={cancelFileUpload}
        >
          CANCEL
        </EduButton>,
        <EduButton
          btnType="primary"
          data-testid="upload-btn"
          width="200px"
          onClick={() => handleFileUpload()}
          disabled={isUploadBtnDisabled}
        >
          {loading ? <Spin /> : 'Upload'}
        </EduButton>,
      ]}
    >
      <Container>
        <StyledRow>
          <StyledCol span={12}>
            <StyledSelect
              placeholder="Select data format"
              onChange={(e) => {
                setCategory(e)
              }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {Object.entries(EXTERNAL_TEST_TYPES).map(([key, value]) => (
                <Option value={key}>{value}</Option>
              ))}
            </StyledSelect>
          </StyledCol>
          <StyledCol span={12}>
            <StyledSelect
              placeholder="Select year"
              onChange={(e) => {
                setVersionYear(e)
              }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {yearDropdownOptions.map(({ key, value }) => (
                <Option value={key}>{value}</Option>
              ))}
            </StyledSelect>
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol span={12}>
            <Input
              placeholder="Enter Test Title"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </StyledCol>
        </StyledRow>

        <Dropzone
          maxSize={MAX_FILE_SIZE}
          onDropRejected={(f) => {
            if (f[0].size > MAX_FILE_SIZE) {
              notification({
                msg: 'Please select a file with size less than 30 MB.',
                type: 'error',
                exact: true,
              })
            }
          }}
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
                {loading ? (
                  <StyledProgress percent={uploadProgress} />
                ) : (
                  <>
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
                        {` : CSV (30MB Max)`}
                      </StyledText>
                    </FlexContainer>
                  </>
                )}
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
    </Modal>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getTestDataFileUploadLoader(state),
    uploadResponse: getTestDataFileUploadResponse(state),
    uploadProgress: getFileUploadProgress(state),
  }),
  {
    uploadFile: uploadTestDataFileAction,
    handleUploadProgress: getUpdateUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
  }
)

export default compose(withConnect)(DataWarehouseUploadModal)

const Modal = styled(CustomModalStyled)``

const Container = styled.div`
  padding: 10px;
`

const DropzoneContentContainer = styled.div`
  margin: 20px 0;
  padding: 50px;
  border-radius: 2px;
  height: 400px;
  display: flex;
  justify-content: center;
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

const StyledProgress = styled(Progress)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  .ant-progress-inner {
    border-radius: 0px;
  }
  .ant-progress-bg {
    border-radius: 0px;
    height: 15px !important;
  }
  .ant-progress-inner {
    background: ${borderGrey};
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

const StyledRow = styled(Row)`
  margin-bottom: 10px;
`

const StyledCol = styled(Col)`
  padding-right: 10px;
`

const StyledSelect = styled(Select)`
  width: 100%;
`
