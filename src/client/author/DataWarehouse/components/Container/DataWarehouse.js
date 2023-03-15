import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { compose } from 'redux'
import { FlexContainer, MainHeader, EduButton } from '@edulastic/common'
import { fadedBlack } from '@edulastic/colors'
import styled from 'styled-components'
import { IconCloudUpload, IconUpload } from '@edulastic/icons'
import DataWarehoureUploadsTable from '../../../Shared/Components/DataWarehouseUploadsTable'
import DataWarehoureUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
} from '../../../sharedDucks/dataWarehouse'
import {
  isPremiumUserSelector,
  isDataWarehouseEnabled as checkIsDataWarehouseEnabled,
  isDataOpsOnlyUser as checkIsDataOpsOnlyUser,
} from '../../../src/selectors/user'

const DataWarehouse = ({
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataWarehouseEnabled,
  isDataOpsOnlyUser,
  isPremiumUser,
}) => {
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
    if (isDataWarehouseEnabled) {
      fetchUploadsStatusList()
    }
  }, [])

  if (!isDataWarehouseEnabled || !isDataOpsOnlyUser || !isPremiumUser) {
    return (
      <NotAllowedContainer>
        Contact your district administrator to upload data.
      </NotAllowedContainer>
    )
  }

  return (
    <div>
      <MainHeader Icon={IconCloudUpload} headingText="Data Warehouse" />
      <FlexContainer justifyContent="right" padding="10px">
        <EduButton height="40px" onClick={showModal}>
          <IconUpload /> Upload External Data Files
        </EduButton>
      </FlexContainer>
      <TableContainer>
        {loading ? (
          <Spin />
        ) : (
          <DataWarehoureUploadsTable
            loading={loading}
            uploadsStatusList={uploadsStatusList}
          />
        )}
      </TableContainer>
      {showTestDataUploadModal && (
        <DataWarehoureUploadModal
          isVisible={showTestDataUploadModal}
          closeModal={closeModal}
        />
      )}
    </div>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
    isDataWarehouseEnabled: checkIsDataWarehouseEnabled(state),
    isDataOpsOnlyUser: checkIsDataOpsOnlyUser(state),
    isPremiumUser: isPremiumUserSelector(state),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
    resetUploadResponse: getResetTestDataFileUploadResponseAction,
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
