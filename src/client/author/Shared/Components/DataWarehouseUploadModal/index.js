import React, { useState, useEffect, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import { Select, Spin, Input, Alert } from 'antd'
import { isEmpty, get } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'

import {
  CustomModalStyled,
  FlexContainer,
  EduButton,
  notification,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import { dataWarehouse } from '@edulastic/constants'

import {
  uploadTestDataFileAction,
  getTestDataFileUploadLoader,
  getTestDataFileUploadResponse,
  getUpdateUploadProgressAction,
  getFileUploadProgress,
  getSetCancelUploadAction,
  getAbortUploadAction,
  getUploadsStatusList,
} from '../../../sharedDucks/dataWarehouse'
import { getOrgDataSelector } from '../../../src/selectors/user'
import {
  getYear,
  dataFormatTreeOptions,
  NON_ACADEMIC_DATA_TYPE_KEY,
} from './utils'
import { getTermOptions } from '../../../utils/reports'
import DownloadTemplate from './DownloadTemplate'
import {
  Container,
  DropzoneContentContainer,
  StyledProgress,
  StyledText,
  Underlined,
  StyledRow,
  StyledCol,
  StyledSelect,
  StyledTreeSelect,
} from './styledComponents'
import FileNameTag from '../../../Reports/components/dataWarehouseReport/common/components/FileNameTag'
import { getTemplateFilePath } from '../../../Reports/components/dataWarehouseReport/importHistory/utils/helpers'

const { Option } = Select
const { MAX_UPLOAD_FILE_SIZE } = dataWarehouse

const DataWarehouseUploadModal = ({
  uploadFile,
  isVisible,
  closeModal,
  uploadsStatusList,
  loading,
  uploadResponse,
  handleUploadProgress,
  uploadProgress,
  setCancelUpload,
  abortUpload,
  terms,
}) => {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [testName, setTestName] = useState('')
  const [termId, setTermId] = useState('')
  const [isInvalidTestName, setIsInvalidTestName] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setFile(null)
      setCategory('')
      setTestName('')
      setTermId('')
    }
  }, [isVisible])

  useEffect(() => {
    if (!isEmpty(uploadResponse)) {
      closeModal(true)
    }
  }, [uploadResponse])

  useEffect(() => {
    const isExistingRecord = uploadsStatusList.some(
      ({ reportType, testName: _testName }) =>
        reportType === category && _testName === testName
    )
    setIsInvalidTestName(isExistingRecord)
  }, [category, testName])

  const schoolYearOptions = useMemo(() => getTermOptions(terms), [terms])

  const testTitlePlaceholder = useMemo(() => {
    let isNonAcademicFormatSelected = false
    if (!isEmpty(category)) {
      const nonAcademicDataOptions =
        dataFormatTreeOptions.find(
          (node) => node.key === NON_ACADEMIC_DATA_TYPE_KEY
        )?.children || []
      if (!isEmpty(nonAcademicDataOptions)) {
        const matchingCategory = nonAcademicDataOptions.find(
          (option) => option.value === category
        )
        isNonAcademicFormatSelected = !isEmpty(matchingCategory)
      }
    }
    return isNonAcademicFormatSelected ? 'Enter File Name' : 'Enter Test Title'
  }, [category])

  const isUploadBtnDisabled =
    loading ||
    [file, category, testName, termId].some(isEmpty) ||
    isInvalidTestName

  const handleFileUpload = () => {
    const termEndDate = schoolYearOptions.find(({ key }) => key === termId)
      ?.endDate
    const versionYear = getYear(termEndDate)
    uploadFile({
      file,
      reportType: category,
      handleUploadProgress,
      setCancelUpload,
      termId,
      testName,
      versionYear,
    })
  }

  return (
    <CustomModalStyled
      modalWidth="853px"
      style={{ height: '549px' }}
      padding="25px"
      visible={isVisible}
      maskClosable={false}
      title="Add new external data"
      onCancel={() => {
        closeModal(false)
      }}
      centered
      footer={[
        <EduButton
          width="200px"
          isGhost
          key="cancelButton"
          onClick={abortUpload}
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
            <StyledTreeSelect
              placeholder="Select Data Type"
              treeDefaultExpandAll
              onChange={setCategory}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              treeData={dataFormatTreeOptions}
              value={category}
            />
          </StyledCol>
          <StyledCol span={12}>
            <StyledSelect
              placeholder="Select School Year"
              onChange={setTermId}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              value={termId}
            >
              {schoolYearOptions.map(({ key, title }) => (
                <Option key={key} value={key}>
                  {title}
                </Option>
              ))}
            </StyledSelect>
          </StyledCol>
        </StyledRow>
        <EduIf condition={!isEmpty(category)}>
          <>
            <EduIf condition={isInvalidTestName}>
              <Alert
                message="Filename already exists, please give another name or go to Edit to edit the existing record"
                type="error"
                banner
              />
            </EduIf>
            <StyledRow>
              <StyledCol span={12}>
                <Input
                  placeholder={testTitlePlaceholder}
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  maxLength={150}
                />
              </StyledCol>
            </StyledRow>
            <DownloadTemplate url={getTemplateFilePath(category)} />
          </>
        </EduIf>
        <Dropzone
          maxSize={MAX_UPLOAD_FILE_SIZE}
          onDropRejected={(f) => {
            if (f[0].size > MAX_UPLOAD_FILE_SIZE) {
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
                      <EduIf condition={file}>
                        <EduThen>
                          <FileNameTag
                            fileName={file?.name}
                            onClose={() => setFile(null)}
                          />
                        </EduThen>
                        <EduElse>
                          <IconUpload />
                          <StyledText>Drag & Drop</StyledText>
                          <StyledText isComment>
                            {`or `}
                            <Underlined>browse</Underlined>
                            {` : CSV (30MB Max)`}
                          </StyledText>
                        </EduElse>
                      </EduIf>
                    </FlexContainer>
                  </>
                )}
              </DropzoneContentContainer>
            )
          }}
        </Dropzone>
      </Container>
    </CustomModalStyled>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getTestDataFileUploadLoader(state),
    uploadResponse: getTestDataFileUploadResponse(state),
    uploadProgress: getFileUploadProgress(state),
    terms: get(getOrgDataSelector(state), 'terms', []),
    uploadsStatusList: getUploadsStatusList(state),
  }),
  {
    uploadFile: uploadTestDataFileAction,
    handleUploadProgress: getUpdateUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
  }
)

export default compose(withConnect)(DataWarehouseUploadModal)
