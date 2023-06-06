import { Col, Row, Spin, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import { EduButton, EduIf, FlexContainer } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import { withRouter } from 'react-router'
import { segmentApi } from '@edulastic/api'
import DataWarehoureUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'
import DataWarehoureUploadsTable from '../../../Shared/Components/DataWarehouseUploadsTable'
import { SubHeader } from '../../common/components/Header'
import { StyledContainer } from '../../common/styled'
import DataWarehoureReportCardsWrapper from './DataWarehouseReportCardsWrapper'

import {
  isDataOpsUser as checkIsDataOpsUser,
  getUserFeatures,
} from '../../../src/selectors/user'

import {
  getResetTestDataFileUploadResponseAction,
  getUploadsStatusList,
  getUploadsStatusListAction,
  getUploadsStatusLoader,
} from '../../../sharedDucks/dataWarehouse'
import { navigationState } from '../../../src/constants/navigation'
import { FloatingAction } from '../StandardReport/SellContent/FloatingAction'

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
  isDataOpsUser,
  features,
  history,
}) => {
  const [showTestDataUploadModal, setShowTestDataUploadModal] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState(REPORTS_TAB.key)

  useEffect(() => {
    if (isDataOpsUser) {
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
  const allowAccess = features.dataWarehouseReports

  const onUpgradeNowClicked = () => {
    segmentApi.genericEventTrack(`DS: upgrade now clicked`, {})
    history.push({
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.DATA_STUDIO },
    })
  }

  const UpgradeBanner = () => (
    <EduIf condition={!allowAccess}>
      <BannerContainer>
        <Row gutter={16}>
          <Col span={20}>
            <div className="text">
              You don’t have an active subscription. Please upgrade your
              subscription to access Data Studio Reports and set / monitor Goals
              and Interventions.
            </div>
          </Col>
          <Col span={4}>
            <div className="button">
              <EduButton height="30px" isGhost onClick={onUpgradeNowClicked}>
                UPGRADE NOW
              </EduButton>
            </div>
          </Col>
        </Row>
      </BannerContainer>
    </EduIf>
  )

  const triggerSegmentEventsOnLanding = () => {
    if (!allowAccess) {
      return segmentApi.genericEventTrack(
        `DS: non subscription landing page visited`,
        {}
      )
    }
    return segmentApi.genericEventTrack(
      `DS: with subscription landing page visited`,
      {}
    )
  }

  useEffect(() => {
    triggerSegmentEventsOnLanding()
  }, [])

  return (
    <>
      <FlexContainer justifyContent="space-between" marginBottom="10px">
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
        <EduIf condition={isDataOpsUser}>
          <EduButton height="40px" onClick={showModal}>
            <IconUpload /> Upload External Data Files
          </EduButton>
        </EduIf>
      </FlexContainer>
      <StyledContainer>
        <EduIf condition={isDataOpsUser}>
          <StyledTabs
            mode="horizontal"
            activeKey={activeTabKey}
            onTabClick={setActiveTabKey}
          >
            <TabPane tab={REPORTS_TAB.label} key={REPORTS_TAB.key}>
              <UpgradeBanner />
              <DataWarehoureReportCardsWrapper
                allowAccess={allowAccess}
                loc={loc}
              />
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
        <EduIf condition={!isDataOpsUser}>
          <UpgradeBanner />
          <DataWarehoureReportCardsWrapper
            allowAccess={allowAccess}
            loc={loc}
          />
        </EduIf>
        <EduIf condition={showTestDataUploadModal}>
          <DataWarehoureUploadModal
            isVisible={showTestDataUploadModal}
            closeModal={closeModal}
          />
        </EduIf>
      </StyledContainer>
      <EduIf condition={!allowAccess}>
        <FloatingAction title="UPGRADE NOW" onUpgrade={onUpgradeNowClicked} />
      </EduIf>
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

const BannerContainer = styled.div`
  .button {
    text-align: right;
    padding: 10px 24px;

    button {
      display: inline;
    }
  }

  .text {
    color: white;
    padding: 16px 24px;
  }

  border-radius: 4px;
  height: 50px;
  background: #313d50;
`

const TableContainer = styled.div`
  min-height: 500px;
`

const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
    isDataOpsUser: checkIsDataOpsUser(state),
    features: getUserFeatures(state),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
    resetUploadResponse: getResetTestDataFileUploadResponseAction,
  }
)

export default withRouter(compose(withConnect)(DataWarehouseReports))
