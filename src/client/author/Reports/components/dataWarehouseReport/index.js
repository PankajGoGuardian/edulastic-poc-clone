import { Col, Divider, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import { EduButton, EduIf, FlexContainer } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import { withRouter } from 'react-router'
import { segmentApi } from '@edulastic/api'
import { roleuser } from '@edulastic/constants'
import DataWarehouseUploadModal from '../../../Shared/Components/DataWarehouseUploadModal'
import { SubHeader } from '../../common/components/Header'
import { StyledContainer } from '../../common/styled'
import DataWarehoureReportCardsWrapper from './DataWarehouseReportCardsWrapper'
import ImportHistory from './importHistory'
import {
  StyledTabs,
  BannerContainer,
} from './common/components/StyledComponents'

import {
  isDataOpsUser as checkIsDataOpsUser,
  getOrgDataSelector,
  getUserFeatures,
  getUserRole,
} from '../../../src/selectors/user'

import {
  getAbortUploadAction,
  getFileUploadProgress,
  getResetTestDataFileUploadResponseAction,
  getSetCancelUploadAction,
  getTestDataFileUploadLoader,
  getTestDataFileUploadResponse,
  getUpdateUploadProgressAction,
  getUploadsStatusList,
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  uploadTestDataFileAction,
  deleteTestDataFileAction,
  getFeedTypesAction,
  getFeedTypes,
} from '../../../sharedDucks/dataWarehouse'
import { navigationState } from '../../../src/constants/navigation'
import { FloatingAction } from '../StandardReport/SellContent/FloatingAction'
import DSPageForDGA from './common/components/DSPageForDGA'

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
  terms,
  userRole,
  features,
  history,
  uploadResponse,
  uploadProgress,
  uploading,
  uploadFile,
  deleteFile,
  handleUploadProgress,
  setCancelUpload,
  abortUpload,
  fetchFeedTypes,
  feedTypes,
}) => {
  const [showTestDataUploadModal, setShowTestDataUploadModal] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState(REPORTS_TAB.key)

  useEffect(() => {
    if (isDataOpsUser) {
      fetchUploadsStatusList()
      if (feedTypes === null) {
        fetchFeedTypes()
      }
    }
  }, [isDataOpsUser, feedTypes])

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
        <Row type="flex">
          <Col>
            <div className="text">
              You don’t have an active Data Studio Subscription. Please upgrade
              to access Data Studio Reports and set/monitor Goals and
              Interventions.
            </div>
          </Col>
          <Col>
            <div className="button">
              <EduButton height="36px" isGhost onClick={onUpgradeNowClicked}>
                LEARN MORE
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

  const ReportCardsComponent =
    userRole === roleuser.DISTRICT_GROUP_ADMIN
      ? DSPageForDGA
      : DataWarehoureReportCardsWrapper

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
              <ReportCardsComponent
                allowAccess={allowAccess}
                loc={loc}
                hasCustomReportAccess={features.customReport}
              />
            </TabPane>
            <TabPane
              tab={IMPORTS_HISTORY_TAB.label}
              key={IMPORTS_HISTORY_TAB.key}
            >
              <Divider style={{ marginBlock: '8px' }} />
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
            </TabPane>
          </StyledTabs>
        </EduIf>
        <EduIf condition={!isDataOpsUser}>
          <UpgradeBanner />
          <ReportCardsComponent
            allowAccess={allowAccess}
            loc={loc}
            hasCustomReportAccess={features.customReport}
          />
        </EduIf>
        <DataWarehouseUploadModal
          isVisible={showTestDataUploadModal}
          closeModal={closeModal}
        />
      </StyledContainer>
      <EduIf condition={!allowAccess}>
        <FloatingAction title="LEARN MORE" onUpgrade={onUpgradeNowClicked} />
      </EduIf>
    </>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
    isDataOpsUser: checkIsDataOpsUser(state),
    userRole: getUserRole(state),
    features: getUserFeatures(state),
    terms: get(getOrgDataSelector(state), 'terms', []),
    uploadResponse: getTestDataFileUploadResponse(state),
    uploadProgress: getFileUploadProgress(state),
    uploading: getTestDataFileUploadLoader(state),
    feedTypes: getFeedTypes(state),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
    fetchFeedTypes: getFeedTypesAction,
    resetUploadResponse: getResetTestDataFileUploadResponseAction,
    uploadFile: uploadTestDataFileAction,
    deleteFile: deleteTestDataFileAction,
    handleUploadProgress: getUpdateUploadProgressAction,
    setCancelUpload: getSetCancelUploadAction,
    abortUpload: getAbortUploadAction,
  }
)

export default withRouter(compose(withConnect)(DataWarehouseReports))
