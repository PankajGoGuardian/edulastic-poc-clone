import React from 'react'
import styled from 'styled-components'

import Breadcrumb from '../../../../src/components/Breadcrumb'

const SubHeader = ({ breadcrumbData, isCliUser, children }) =>
  !isCliUser ? (
    <SecondaryHeader
      style={{
        marginBottom: 20,
        paddingLeft: '5px',
      }}
    >
      <HeaderTitle>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </HeaderTitle>
      {children}
    </SecondaryHeader>
  ) : null

export default SubHeader

const HeaderTitle = styled.div`
  min-width: 230px;
  max-width: 280px;
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
`

const SecondaryHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  @media print {
    display: none;
  }
`
