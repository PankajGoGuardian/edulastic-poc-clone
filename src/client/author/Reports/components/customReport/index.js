import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Spin } from 'antd'
import styled from 'styled-components'
import { IconUpload } from '@edulastic/icons'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { EduButton, FlexContainer } from '@edulastic/common'
import { StyledContainer } from '../../common/styled'
import { SubHeader } from '../../common/components/Header'
import DataWarehoureUploadsTable from '../../../Shared/Components/DataWarehouseUploadsTable'
import DataWarehoureUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'
import CustomReportsWrapper from './CustomReportsWrapper'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
} from '../../../sharedDucks/dataWarehouse'
import {
  isDataWarehouseEnabled as checkIsDataWarehouseEnabled,
  isDataOpsUser as checkIsDataOpsUser,
  isPremiumUserSelector,
} from '../../../src/selectors/user'

const CustomReports = ({
  history,
  breadcrumbData,
  isCliUser,
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataWarehouseEnabled,
  isDataOpsUser,
  isPremiumUser,
}) => {
  const [showTestDataUploadModal, setShowTestDataUploadModal] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState('reports')

  const isDataWarehouseEnabledForUser = useMemo(
    () => isDataWarehouseEnabled && isDataOpsUser && isPremiumUser,
    [isDataWarehouseEnabled, isDataOpsUser, isPremiumUser]
  )

  useEffect(() => {
    if (isDataWarehouseEnabledForUser) {
      fetchUploadsStatusList()
    }
  }, [])

  const showReport = (_id) => {
    history.push(`/author/reports/custom-reports/${_id}`)
  }

  const closeModal = (shouldChangeTab) => {
    setShowTestDataUploadModal(false)
    if (shouldChangeTab) {
      setActiveTabKey('status')
      fetchUploadsStatusList()
    }
    resetUploadResponse()
  }

  const showModal = () => {
    setShowTestDataUploadModal(true)
  }

  return (
    <>
      <FlexContainer justifyContent="space-between" marginBottom="10px">
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
        {isDataWarehouseEnabledForUser && (
          <EduButton isGhost height="100%" onClick={() => showModal()}>
            <IconUpload /> Upload national / state tests data files
          </EduButton>
        )}
      </FlexContainer>
      <StyledContainer>
        {isDataWarehouseEnabledForUser ? (
          <StyledTabs
            mode="horizontal"
            activeKey={activeTabKey}
            onTabClick={(key) => setActiveTabKey(key)}
          >
            <StyledTabPane tab="Reports" key="reports">
              <CustomReportsWrapper showReport={showReport} />
            </StyledTabPane>
            <StyledTabPane tab="Imports history" key="importsHistory">
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
            </StyledTabPane>
          </StyledTabs>
        ) : (
          <CustomReportsWrapper showReport={showReport} />
        )}
        {showTestDataUploadModal && (
          <DataWarehoureUploadModal
            isVisible={showTestDataUploadModal}
            closeModal={closeModal}
          />
        )}
      </StyledContainer>
    </>
  )
}

CustomReports.propTypes = {
  history: PropTypes.object.isRequired,
}

const StyledTabPane = styled(Tabs.TabPane)``
const StyledTabs = styled(Tabs)`
  width: 100%;
  margin-left: 0;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
  .ant-tabs-nav-scroll {
    margin-bottom: 10px;
  }
`
const TableContainer = styled.div`
  min-height: 500px;
`

const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
    isDataWarehouseEnabled: checkIsDataWarehouseEnabled(state),
    isDataOpsUser: checkIsDataOpsUser(state),
    isPremiumUser: isPremiumUserSelector(state),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
    resetUploadResponse: getResetTestDataFileUploadResponseAction,
  }
)

export default compose(withConnect)(CustomReports)
