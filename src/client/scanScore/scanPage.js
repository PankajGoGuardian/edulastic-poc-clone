import React from 'react'
import { Layout } from 'antd'
import { themeColor } from '@edulastic/colors'
import styled from 'styled-components'

const { Content } = Layout

export default function ScanPage({ children, title }) {
  return (
    <Layout>
      <StyledHeader>
        <div className="top" />
        <div className="bottom">
          <h2 className="title">{title}</h2>
        </div>
      </StyledHeader>
      <Content>{children}</Content>
    </Layout>
  )
}

const StyledHeader = styled.div`
  .top {
    background: #fff;
    height: 53px;
    width: 100%;
  }
  .bottom {
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
  }
`
