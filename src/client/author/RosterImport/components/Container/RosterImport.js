import React, { useState, useEffect } from 'react'
import {
  notification,
  FlexContainer,
  RadioGrp,
  EduButton,
} from '@edulastic/common'
import { Popover, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { compose } from 'redux'
import DataExport from '../SubContainer/DataExport'
import RosterHistory from '../SubContainer/RosterHistory'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import { StyledContent } from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  CustomUploadStyledLayout,
  CustomHistoryStyledLayout,
  CustomSettingsWrapper,
  StyledSpincontainer,
  UploadDragger,
  StyledHeading1,
  Container,
  StyledSpan,
  CustomRadioBtn,
  InfoIcon,
} from './styled'
import { StyledSpin } from '../../../../admin/Common/StyledComponents'
import {
  Label,
  RadioButtonWrapper,
} from '../../../AssignTest/components/SimpleOptions/styled'
import {
  getIsLoading,
  getRosterImportLog,
  getFileUploadProgress,
  getIsRosterZipFileUploading,
  receiveRosterLogAction,
  uploadOneRosterZipFileAction,
  getUpdateOfZipUploadProgressAction,
  getSetCancelUploadAction,
  getAbortUploadAction,
  getOneRosterSyncSummary,
  getOneRosterSyncStatus,
  oneRosterSyncStatus,
  downloadCsvErrorDataAction,
} from '../../duck'

import { getUserId } from '../../../src/selectors/user'

const title = 'Manage District'
const oneRosterSyncType = {
  DELTA: 'delta',
  FULL: 'full',
  ACCOMODATION: 'accomodation',
}
const RosterImport = ({
  history,
  uploadFile,
  handleUploadProgress,
  setCancelUpload,
  abortUpload,
  isFileUploading,
  loading,
  uploadProgress,
  rosterImportLog,
  loadRosterLogs,
  summary,
  syncStatus,
  downloadCsvErrorData,
}) => {
  const menuActive = { mainMenu: 'Settings', subMenu: 'Import Sis Data' }
  const showSpin = loading
  const [isDragging, setIsDragging] = useState(false)
  const [selectedSyncType, setSelectedSyncType] = useState('')

  useEffect(() => {
    loadRosterLogs()
  }, [])

  const cancelUpload = () => {
    abortUpload()
  }

  const onChange = ({ file }) => {
    if (!selectedSyncType) {
      notification({ msg: 'Please select any one sync type to proceed' })
      return
    }
    if (syncStatus === oneRosterSyncStatus.IN_PROGRESS) {
      notification({ messageKey: 'syncInProgress' })
      return
    }
    const { name: fileName } = file
    const fileExtension = fileName.split('.')?.[fileName.split('.').length - 1]
    if (fileExtension !== 'zip') {
      notification({ messageKey: 'fileFormatNotSupportedUploadZip' })
      return
    }
    if (file.size / 1024000 > 100) {
      notification({ messageKey: 'fileSizeExceeds100Mb' })
      return
    }
    uploadFile({
      file,
      handleUploadProgress,
      setCancelUpload,
      syncType: selectedSyncType,
    })
  }

  const handleSyncOptionChange = (e) => {
    setSelectedSyncType(e.target.value)
  }

  return (
    <CustomSettingsWrapper>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <AdminSubHeader active={menuActive} history={history} />
        {showSpin && (
          <StyledSpincontainer loading={showSpin}>
            <StyledSpin size="large" />
          </StyledSpincontainer>
        )}
        {!loading && (
          <>
            <Container>
              <StyledHeading1>Import SIS Data</StyledHeading1>
              <p>
                Choose the import type and import data securely by attaching csv
                files with a zip file format.
              </p>
              <FlexContainer
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mt="30px"
              >
                <StyledSpan>
                  SELECT AN OPTION
                  <RadioGrp
                    style={{ display: 'flex' }}
                    onChange={handleSyncOptionChange}
                    value={selectedSyncType}
                  >
                    <RadioButtonWrapper>
                      <CustomRadioBtn value={oneRosterSyncType.DELTA} />
                      <Label>DELTA SYNC</Label>
                    </RadioButtonWrapper>
                    <RadioButtonWrapper style={{ marginLeft: '20px' }}>
                      <CustomRadioBtn value={oneRosterSyncType.FULL} />
                      <Label>FULL SYNC</Label>
                    </RadioButtonWrapper>
                    <Tooltip title="Feature to be released in future.">
                      <RadioButtonWrapper style={{ marginLeft: '20px' }}>
                        <CustomRadioBtn
                          disabled
                          value={oneRosterSyncType.ACCOMODATION}
                        />
                        <Label disabled>ACCOMODATIONS</Label>
                      </RadioButtonWrapper>
                    </Tooltip>
                  </RadioGrp>
                </StyledSpan>
                <FlexContainer
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FlexContainer
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Popover
                      placement="topRight"
                      content="Instruction for uploading the zip"
                    >
                      <InfoIcon />
                    </Popover>
                    <p style={{ fontSize: '12px', marginLeft: '5px' }}>
                      VIEW INSTRUCTIONS
                    </p>
                  </FlexContainer>
                  <EduButton ml="40px">Download Examples Files</EduButton>
                </FlexContainer>
              </FlexContainer>
            </Container>
            <CustomUploadStyledLayout
              onDragOver={() => setIsDragging(true)}
              onDrop={() => setIsDragging(false)}
              onDragLeave={() => setIsDragging(false)}
              isDragging={isDragging}
              loading="false"
            >
              <UploadDragger
                name="file"
                onChange={onChange}
                beforeUpload={() => false}
                multiple={false}
                accept=".zip, zip, application/zip"
                showUploadList={false}
              >
                <DataExport
                  isFileUploading={isFileUploading}
                  uploadProgress={uploadProgress}
                  cancelUpload={cancelUpload}
                />
              </UploadDragger>
            </CustomUploadStyledLayout>
            <CustomHistoryStyledLayout>
              <RosterHistory
                rosterImportLog={rosterImportLog}
                summary={summary}
                downloadCsvErrorData={downloadCsvErrorData}
              />
            </CustomHistoryStyledLayout>
          </>
        )}
      </StyledContent>
    </CustomSettingsWrapper>
  )
}

const withConnect = connect(
  (state) => ({
    userId: getUserId(state),
    loading: getIsLoading(state),
    rosterImportLog: getRosterImportLog(state),
    isFileUploading: getIsRosterZipFileUploading(state),
    uploadProgress: getFileUploadProgress(state),
    summary: getOneRosterSyncSummary(state),
    syncStatus: getOneRosterSyncStatus(state),
  }),
  {
    loadRosterLogs: receiveRosterLogAction,
    uploadFile: uploadOneRosterZipFileAction,
    handleUploadProgress: getUpdateOfZipUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
    downloadCsvErrorData: downloadCsvErrorDataAction,
  }
)

export default compose(withConnect)(RosterImport)
