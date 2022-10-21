import React from 'react'
import styled from 'styled-components'

import Breadcrumb from '../../../../src/components/Breadcrumb'

const SubHeader = ({ breadcrumbData, isCliUser, alignment, children }) => (
  <SecondaryHeader alignItems={alignment}>
    {!isCliUser ? (
      <HeaderTitle className="report-breadcrumb">
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </HeaderTitle>
    ) : null}
    {children}
  </SecondaryHeader>
)

export default SubHeader

const HeaderTitle = styled.div`
  h1 {
    font-size: 25px;
    font-weight: bold;
    color: white;
    margin: 0px;
    display: flex;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
      fill: white;
      margin-right: 10px;
    }
  }
  .ant-breadcrumb {
    white-space: nowrap;
    min-width: 230px;
    max-width: 360px;
  }
`

const SecondaryHeader = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  padding-left: 5px;
  justify-content: space-between;
  align-items: ${({ alignItems }) => alignItems || 'center'};
  @media print {
    padding-left: 0px;
    .report-breadcrumb {
      display: none;
    }
  }
`
