import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { compose } from 'redux'
import { get } from 'lodash'
import { EduButton, FlexContainer, MainHeader } from '@edulastic/common'
import { fadedBlack } from '@edulastic/colors'
import styled from 'styled-components'
import { IconUpload, IconCloudUpload } from '@edulastic/icons'
import DataWarehoureUploadsTable from '../../../Shared/Components/DataWarehouseUploadsTable'
import DataWarehoureUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
} from '../../../sharedDucks/dataWarehouse'

const DataWarehouse = ({
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataWarehouseEnabled,
  isDataOpsOnlyUser,
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

  if (!isDataWarehouseEnabled || !isDataOpsOnlyUser) {
    return (
      <NotAllowedContainer>
        District is not enabled with data warehouse feature.
      </NotAllowedContainer>
    )
  }

  return (
    <div>
      <MainHeader Icon={IconCloudUpload} headingText="Data Warehouse" />
      <FlexContainer justifyContent="right" padding="10px">
        <EduButton isGhost height="100%" onClick={() => showModal()}>
          <IconUpload /> Upload national / state tests data files
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
    isDataWarehouseEnabled: get(
      state,
      ['user', 'user', 'features', 'isDataWarehouseEnabled'],
      false
    ),
    isDataOpsOnlyUser: get(state, [
      'user',
      'user',
      'features',
      'isDataOpsOnlyUser',
    ]),
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
