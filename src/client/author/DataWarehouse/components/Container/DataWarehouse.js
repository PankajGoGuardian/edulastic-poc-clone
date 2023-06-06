import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { compose } from 'redux'
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
import DataWarehoureUploadsTable from '../../../Shared/Components/DataWarehouseUploadsTable'
import DataWarehoureUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
} from '../../../sharedDucks/dataWarehouse'
import {
  isDataOpsUser as checkIsDataOpsUser,
  isDataOpsOnlyUser as checkIsDataOpsOnlyUser,
} from '../../../src/selectors/user'

const DataWarehouse = ({
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataOpsUser,
  isDataOpsOnlyUser,
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
    }
  }, [])

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
    isDataOpsUser: checkIsDataOpsUser(state),
    isDataOpsOnlyUser: checkIsDataOpsOnlyUser(state),
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
