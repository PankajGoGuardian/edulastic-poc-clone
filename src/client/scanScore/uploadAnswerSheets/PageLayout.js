import React from 'react'
import { Layout } from 'antd'
import { themeColor } from '@edulastic/colors'
import styled from 'styled-components'

import Breadcrumb from '../../author/src/components/Breadcrumb'

const { Content } = Layout

export const PageLayout = ({ children, title, breadcrumbData = [] }) => (
  <Layout>
    <StyledHeader>
      <h2 className="title">{title}</h2>
    </StyledHeader>
    <Content>
      <div style={{ width: '100%', padding: '5px 30px' }}>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </div>
      {children}
    </Content>
  </Layout>
)

export default PageLayout

const StyledHeader = styled.div`
  background: ${themeColor};
  height: 53px;
  width: 100%;
  .title {
    padding-left: 29.6px;
    color: #fff;
    font-family: Open Sans;
    font-weight: bold;
    font-size: 18px;
    line-height: 53px;
  }
`
