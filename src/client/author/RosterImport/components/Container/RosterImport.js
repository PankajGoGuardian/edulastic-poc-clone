import React, { useState, useEffect } from 'react'
import { notification } from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { CancelButton } from '@edulastic/common/src/components/TypeToConfirmModal/styled'
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
} from '../../duck'
// import {
//   uploadOneRosterZipFileAction,
//   getUpdateOfZipUploadProgressAction,
//   getSetCancelUploadAction,
//   getAbortUploadAction,
//   getIsRosterZipFileUploading,
//   getFileUploadProgress,
// } from '../../../DistrictPolicy/ducks'
// import { DropAreaContainer } from '../../../AssessmentCreate/components/DropArea/styled'

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
}) => {
  const menuActive = { mainMenu: 'Settings', subMenu: 'Roster Import' }
  const showSpin = loading
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadRosterLogs()
  }, [])

  const cancelUpload = () => {
    abortUpload()
  }

  const onChange = ({ file }) => {
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
    <>
      <CustomSettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <AdminSubHeader active={menuActive} history={history} />
          {showSpin && (
            <StyledSpincontainer>
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
                  // accept=".zip, zip, application/zip"
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
                <RosterHistory rosterImportLog={rosterImportLog} />
              </CustomStyledLayout>
            </>
          )}
        </StyledContent>
      </CustomSettingsWrapper>
    </>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getIsLoading(state),
    rosterImportLog: getRosterImportLog(state),
    isFileUploading: getIsRosterZipFileUploading(state),
    uploadProgress: getFileUploadProgress(state),
  }),
  {
    loadRosterLogs: receiveRosterLogAction,
    uploadFile: uploadOneRosterZipFileAction,
    handleUploadProgress: getUpdateOfZipUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
  }
)

export default compose(withConnect)(RosterImport)
