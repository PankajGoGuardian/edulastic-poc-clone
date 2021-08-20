import React from 'react'
import { Layout } from 'antd'
import {
  themeColor,
  borderGrey4,
  greyThemeDark4,
  tagTextColor,
  tagsBgColor,
} from '@edulastic/colors'
import styled from 'styled-components'
import { IconLogoCompact } from '@edulastic/icons'

import Breadcrumb from '../../author/src/components/Breadcrumb'

const { Content } = Layout

const PageLayout = ({
  children,
  breadcrumbData = [],
  assignmentTitle,
  classTitle,
  isScanProgressScreen,
}) => (
  <Layout>
    <StyledHeader>
      <IconLogoCompact className="logo" />
      <h2 className="title">SnapScore</h2>
      <h1 className="assignmentTitle">{assignmentTitle}</h1>
      <h3 className="classTitle">{classTitle}</h3>
    </StyledHeader>
    <Content style={{ padding: '0 50px' }}>
      <div style={{ padding: '20px 0' }}>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </div>
      {!isScanProgressScreen && (
        <StyledTitle>Scan Student Responses</StyledTitle>
      )}
      {children}
    </Content>
  </Layout>
)

export default PageLayout

const StyledHeader = styled.div`
  height: 45px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${borderGrey4};

  .logo {
    fill: ${themeColor};
    margin-left: 21px;
    margin-right: 6px;
  }

  .title {
    font: italic normal 700 17px/22px Open Sans;
    color: ${themeColor};
    text-align: left;
    margin-top: unset;
    margin-bottom: 2px;
    margin-right: 40px;

    &::after {
      content: '|';
      position: absolute;
      font: normal normal 700 17px/22px Open Sans;
      color: ${borderGrey4};
      margin-left: 15px;
    }
  }

  .assignmentTitle {
    text-align: left;
    font: normal normal bold 17px/22px Open Sans;
    letter-spacing: 0px;
    margin-top: auto;

    color: ${greyThemeDark4};
  }

  .classTitle {
    text-align: left;
    border-radius: 2px;
    font: normal normal bold 8px/11px Open Sans;
    letter-spacing: 0.15px;
    color: ${tagTextColor};
    text-transform: uppercase;
    background: ${tagsBgColor};
    padding: 3px 6px;
    margin-left: 10px;
    margin-top: unset;
    margin-bottom: 2px;
  }
`

const StyledTitle = styled.p`
  font: normal normal bold 16px/22px Open Sans;
  margin-top: 20px;
  margin-left: 20px;
`
