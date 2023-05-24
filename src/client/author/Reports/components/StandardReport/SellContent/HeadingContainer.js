import { Row, Col } from 'antd'
import React from 'react'
import styled from 'styled-components'

export const HeadingContainer = ({ heading, icon }) => (
  <StyledRow gutter={12} type="flex">
    <Col>{icon}</Col>
    <Col>
      <div className="heading">{heading}</div>
    </Col>
  </StyledRow>
)

const StyledRow = styled(Row)`
  padding: 16px 0px;

  .icon {
    line-height: 32px;
  }

  .heading {
    font-weight: bold;
    font-size: 14px;
  }
`
