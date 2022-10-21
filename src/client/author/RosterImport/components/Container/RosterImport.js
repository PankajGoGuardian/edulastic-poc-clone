import React, { useState, useEffect } from 'react'
import { notification } from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import DataExport from '../SubContainer/DataExport'
import RosterHistory from '../SubContainer/RosterHistory'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import { StyledContent } from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  CustomStyledLayout,
  CustomSettingsWrapper,
  StyledSpincontainer,
  UploadDragger,
} from './styled'
import { StyledSpin } from '../../../../admin/Common/StyledComponents'
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
  const menuActive = { mainMenu: 'Settings', subMenu: 'OneRoster Import' }
  const showSpin = loading
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadRosterLogs()
  }, [])

  const cancelUpload = () => {
    abortUpload()
  }

  const onChange = ({ file }) => {
    if (syncStatus === oneRosterSyncStatus.IN_PROGRESS) {
      notification({ messageKey: 'syncInProgress' })
      return
    }
    if (file.type !== 'application/zip') {
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
    })
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
            <CustomStyledLayout
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
            </CustomStyledLayout>
            <CustomStyledLayout>
              <RosterHistory
                rosterImportLog={rosterImportLog}
                summary={summary}
                downloadCsvErrorData={downloadCsvErrorData}
              />
            </CustomStyledLayout>
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
