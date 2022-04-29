import React from 'react'
import { Tabs } from 'antd'
import styled from 'styled-components'

import { EduButton, FlexContainer } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import { SubHeader } from '../../common/components/Header'

const CustomReportSubHeader = ({ breadcrumbData, isCliUser, showModal }) => {
  return (
    <FlexContainer justifyContent="space-between" marginBottom="10px">
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
      <StyledTabs mode="horizontal">
        <StyledTabPane tab="Reports" key="" />
        <StyledTabPane tab="Status" key="status" />
      </StyledTabs>
      <EduButton isGhost height="100%" onClick={() => showModal()}>
        <IconUpload /> Upload Test Data Files SUCH AS CAASP, ELAPAC, IREADY AND
        OTHER
      </EduButton>
    </FlexContainer>
  )
}

export const StyledTabPane = styled(Tabs.TabPane)``
export const StyledTabs = styled(Tabs)`
  padding: 0 3%;
  width: 100%;
  margin-left: 0;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
  .ant-tabs-nav-scroll {
    display: flex;
    justify-content: center;
  }
`

export default CustomReportSubHeader
