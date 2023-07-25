import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import {
  FlexContainer,
  MainHeader,
  EduButton,
  EduIf,
  EduElse,
  EduThen,
} from '@edulastic/common'
import { fadedBlack } from '@edulastic/colors'
import styled from 'styled-components'
import { IconCloudUpload, IconUpload } from '@edulastic/icons'
import DataWarehouseUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
  getTestDataFileUploadLoader,
  getFileUploadProgress,
  getTestDataFileUploadResponse,
  uploadTestDataFileAction,
  deleteTestDataFileAction,
  getUpdateUploadProgressAction,
  getSetCancelUploadAction,
  getAbortUploadAction,
  getFeedTypesAction,
} from '../../../sharedDucks/dataWarehouse'
import {
  isDataOpsUser as checkIsDataOpsUser,
  isDataOpsOnlyUser as checkIsDataOpsOnlyUser,
  getOrgDataSelector,
} from '../../../src/selectors/user'
import ImportHistory from '../../../Reports/components/dataWarehouseReport/importHistory'

const DataWarehouse = ({
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataOpsUser,
  isDataOpsOnlyUser,
  terms,
  uploadResponse,
  uploadProgress,
  uploading,
  uploadFile,
  deleteFile,
  handleUploadProgress,
  setCancelUpload,
  abortUpload,
  fetchFeedTypes,
}) => {
  const dataOpsEnabled = isDataOpsUser || isDataOpsOnlyUser
  const [showTestDataUploadModal, setShowTestDataUploadModal] = useState(false)

  const closeModal = (shouldFetchStatusList) => {
    setShowTestDataUploadModal(false)
    if (shouldFetchStatusList) {
      fetchUploadsStatusList()
    }
    resetUploadResponse()
  }

  const showModal = () => {
    setShowTestDataUploadModal(true)
  }

  useEffect(() => {
    if (dataOpsEnabled) {
      fetchUploadsStatusList()
      fetchFeedTypes()
    }
  }, [dataOpsEnabled])

  return (
    <EduIf condition={dataOpsEnabled}>
      <EduThen>
        <div>
          <MainHeader Icon={IconCloudUpload} headingText="Data Warehouse" />
          <FlexContainer justifyContent="right" padding="10px">
            <EduButton height="40px" onClick={showModal}>
              <IconUpload /> Upload External Data Files
            </EduButton>
          </FlexContainer>
          <TableContainer>
            <ImportHistory
              loading={loading}
              uploadsStatusList={uploadsStatusList}
              terms={terms}
              uploadResponse={uploadResponse}
              uploadProgress={uploadProgress}
              uploading={uploading}
              uploadFile={uploadFile}
              deleteFile={deleteFile}
              handleUploadProgress={handleUploadProgress}
              setCancelUpload={setCancelUpload}
              abortUpload={abortUpload}
            />
          </TableContainer>
          <DataWarehouseUploadModal
            isVisible={showTestDataUploadModal}
            closeModal={closeModal}
          />
        </div>
      </EduThen>
      <EduElse>
        <NotAllowedContainer>
          Contact your district administrator to upload data.
        </NotAllowedContainer>
      </EduElse>
    </EduIf>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
    uploadResponse: getTestDataFileUploadResponse(state),
    uploadProgress: getFileUploadProgress(state),
    uploading: getTestDataFileUploadLoader(state),
    isDataOpsUser: checkIsDataOpsUser(state),
    isDataOpsOnlyUser: checkIsDataOpsOnlyUser(state),
    terms: get(getOrgDataSelector(state), 'terms', []),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
    resetUploadResponse: getResetTestDataFileUploadResponseAction,
    uploadFile: uploadTestDataFileAction,
    deleteFile: deleteTestDataFileAction,
    handleUploadProgress: getUpdateUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
    fetchFeedTypes: getFeedTypesAction,
  }
)

export default compose(withConnect)(DataWarehouse)

const TableContainer = styled.div`
  padding: 10px;
  min-height: 500px;
`

const NotAllowedContainer = styled.div`
  background: white;
  color: ${fadedBlack};
  margin-top: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize || '25px'};
  font-weight: 700;
  text-align: 'center';
`
