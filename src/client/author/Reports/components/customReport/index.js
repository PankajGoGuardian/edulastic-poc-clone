import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Spin } from 'antd'
import styled from 'styled-components'
import { IconUpload } from '@edulastic/icons'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import { EduButton, FlexContainer } from '@edulastic/common'
import { StyledContainer } from '../../common/styled'
import TestDataUploadModal from './TestDataUploadModal'
import { SubHeader } from '../../common/components/Header'
import TestDataUploadsTable from './TestDataUploadsTable'
import CustomReportsWrapper from './CustomReportsWrapper'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
  getResetTestDataFileUploadResponseAction,
} from './ducks'

const CustomReports = ({
  history,
  breadcrumbData,
  isCliUser,
  loading,
  uploadsStatusList,
  fetchUploadsStatusList,
  resetUploadResponse,
  isDataWarehouseEnabled,
}) => {
  const [showTestDataUploadModal, setShowTestDataUploadModal] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState('reports')

  useEffect(() => {
    fetchUploadsStatusList()
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
        {isDataWarehouseEnabled && (
          <EduButton isGhost height="100%" onClick={() => showModal()}>
            <IconUpload /> Upload Test Data Files SUCH AS CAASP, ELAPAC, IREADY
            AND OTHER
          </EduButton>
        )}
      </FlexContainer>
      <StyledContainer>
        {isDataWarehouseEnabled ? (
          <StyledTabs
            mode="horizontal"
            activeKey={activeTabKey}
            onTabClick={(key) => setActiveTabKey(key)}
          >
            <StyledTabPane tab="Reports" key="reports">
              <CustomReportsWrapper showReport={showReport} />
            </StyledTabPane>
            <StyledTabPane tab="Status" key="status">
              {loading ? (
                <Spin />
              ) : (
                <TestDataUploadsTable
                  loading={loading}
                  uploadsStatusList={uploadsStatusList}
                />
              )}
            </StyledTabPane>
          </StyledTabs>
        ) : (
          <CustomReportsWrapper showReport={showReport} />
        )}
        {showTestDataUploadModal && (
          <TestDataUploadModal
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

export const StyledTabPane = styled(Tabs.TabPane)``
export const StyledTabs = styled(Tabs)`
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
const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
    isDataWarehouseEnabled: get(
      state,
      ['user', 'user', 'features', 'isDataWarehouseEnabled'],
      false
    ),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
    resetUploadResponse: getResetTestDataFileUploadResponseAction,
  }
)

export default compose(withConnect)(CustomReports)
