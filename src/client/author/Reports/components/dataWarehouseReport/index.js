import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Tabs, Spin } from 'antd'

import { FlexContainer, EduButton, EduIf } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import {
  IconWholeChildReport,
  IconMultipleAssessmentReportDW,
  IconSingleAssessmentReportDW,
  IconPreVsPostTestComparisonReport,
} from '@edulastic/icons'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import { SubHeader } from '../../common/components/Header'
import { StyledContainer } from '../../common/styled'
import DataWarehoureUploadsTable from '../../../Shared/Components/DataWarehouseUploadsTable'
import DataWarehoureUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'
import DataWarehoureReportCardsWrapper from './DataWarehouseReportCardsWrapper'

import {
  isDataWarehouseEnabled as checkIsDataWarehouseEnabled,
  isDataOpsUser as checkIsDataOpsUser,
  isPremiumUserSelector,
} from '../../../src/selectors/user'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
} from '../../../sharedDucks/dataWarehouse'

const TabPane = Tabs.TabPane
const IMPORTS_HISTORY_TAB = {
  key: 'importsHistory',
  label: 'IMPORTS HISTORY',
}
const REPORTS_TAB = {
  key: 'reports',
  label: 'REPORTS',
}

const DataWarehouseReports = ({
  breadcrumbData,
  isCliUser,
  loc,
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataWarehouseEnabled,
  isDataOpsUser,
  isPremiumUser,
}) => {
  const [showTestDataUploadModal, setShowTestDataUploadModal] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState(REPORTS_TAB.key)
  const isDataWarehouseEnabledForUser =
    isDataWarehouseEnabled && isDataOpsUser && isPremiumUser

  useEffect(() => {
    if (isDataWarehouseEnabledForUser) {
      fetchUploadsStatusList()
    }
  }, [])

  const closeModal = (shouldChangeTab) => {
    setShowTestDataUploadModal(false)
    if (shouldChangeTab) {
      setActiveTabKey(IMPORTS_HISTORY_TAB.key)
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
        <EduIf condition={isDataWarehouseEnabledForUser}>
          <EduButton height="40px" onClick={showModal}>
            <IconUpload /> Upload External Data Files
          </EduButton>
        </EduIf>
      </FlexContainer>
      <FeaturesSwitch
        inputFeatures="dataWarehouseReports"
        actionOnInaccessible="hidden"
      >
        <StyledContainer>
          <EduIf condition={isDataWarehouseEnabledForUser}>
            <StyledTabs
              mode="horizontal"
              activeKey={activeTabKey}
              onTabClick={setActiveTabKey}
            >
              <TabPane tab={REPORTS_TAB.label} key={REPORTS_TAB.key}>
                <DataWarehoureReportCardsWrapper loc={loc} />
              </TabPane>
              <TabPane
                tab={IMPORTS_HISTORY_TAB.label}
                key={IMPORTS_HISTORY_TAB.key}
              >
                <TableContainer>
                  <Spin spinning={loading}>
                    <DataWarehoureUploadsTable
                      loading={loading}
                      uploadsStatusList={uploadsStatusList}
                    />
                  </Spin>
                </TableContainer>
              </TabPane>
            </StyledTabs>
          </EduIf>
          <EduIf condition={!isDataWarehouseEnabledForUser}>
            <DataWarehoureReportCardsWrapper loc={loc} />
          </EduIf>
          <EduIf condition={showTestDataUploadModal}>
            <DataWarehoureUploadModal
              isVisible={showTestDataUploadModal}
              closeModal={closeModal}
            />
          </EduIf>
        </StyledContainer>
      </FeaturesSwitch>
    </>
  )
}

const StyledTabs = styled(Tabs)`
  width: 100%;
  margin-left: 0;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
  .ant-tabs-nav-scroll {
    margin-bottom: 20px;
  }
  .ant-tabs-tab {
    font-weight: bold;
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

export default compose(withConnect)(DataWarehouseReports)
