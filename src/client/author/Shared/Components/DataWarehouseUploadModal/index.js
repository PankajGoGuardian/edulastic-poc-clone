import React, { useState, useEffect, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import { Icon, Select, Spin, Input } from 'antd'
import { isEmpty, get } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'

import {
  CustomModalStyled,
  FlexContainer,
  EduButton,
  notification,
} from '@edulastic/common'
import { greyThemeDark3 } from '@edulastic/colors'
import { IconUpload } from '@edulastic/icons'
import { testTypes, dataWarehouse } from '@edulastic/constants'

import cdnURI from '../../../../../app-config'
import {
  uploadTestDataFileAction,
  getTestDataFileUploadLoader,
  getTestDataFileUploadResponse,
  getUpdateUploadProgressAction,
  getFileUploadProgress,
  getSetCancelUploadAction,
  getAbortUploadAction,
} from '../../../sharedDucks/dataWarehouse'
import { getOrgDataSelector } from '../../../src/selectors/user'
import { getYear, dataFormatTreeOptions } from './utils'
import { getTermOptions } from '../../../utils/reports'
import DownloadTemplateContainer from './DownloadTemplateContainer'
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

const { Option } = Select
const { NON_ACADEMIC_DATA_TYPES } = testTypes
const { MAX_UPLOAD_FILE_SIZE } = dataWarehouse
const NON_ACADEMIC_DATA_TYPE_KEY = 'nonAcademicData'

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
  terms,
}) => {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [testName, setTestName] = useState('')
  const [termId, setTermId] = useState('')

  useEffect(() => {
    if (!isEmpty(uploadResponse)) {
      closeModal(true)
    }
  }, [uploadResponse])

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
    loading || [file, category, testName, termId].some(isEmpty)

  const handleFileUpload = () => {
    const termEndDate = schoolYearOptions.find(({ key }) => key === termId)
      ?.endDate
    const versionYear = getYear(termEndDate)
    uploadFile({
      file,
      category,
      handleUploadProgress,
      setCancelUpload,
      termId,
      testName,
      versionYear,
    })
  }

  return (
    <CustomModalStyled
      modalWidth="800px"
      style={{ height: '800px' }}
      visible={isVisible}
      maskClosable={false}
      title="Upload External Data"
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
            />
          </StyledCol>
          <StyledCol span={12}>
            <StyledSelect
              placeholder="Select School Term"
              onChange={setTermId}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {schoolYearOptions.map(({ key, title }) => (
                <Option key={key} value={key}>
                  {title}
                </Option>
              ))}
            </StyledSelect>
          </StyledCol>
        </StyledRow>
        {!isEmpty(category) && (
          <StyledRow>
            <StyledCol span={12}>
              <Input
                placeholder={testTitlePlaceholder}
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </StyledCol>
          </StyledRow>
        )}
        {category === NON_ACADEMIC_DATA_TYPES.ATTENDANCE && (
          <DownloadTemplateContainer
            url={`${cdnURI}/templates/AttendanceSampleFile.csv`}
          />
        )}
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
    </CustomModalStyled>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getTestDataFileUploadLoader(state),
    uploadResponse: getTestDataFileUploadResponse(state),
    uploadProgress: getFileUploadProgress(state),
    terms: get(getOrgDataSelector(state), 'terms', []),
  }),
  {
    uploadFile: uploadTestDataFileAction,
    handleUploadProgress: getUpdateUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
  }
)

export default compose(withConnect)(DataWarehouseUploadModal)
