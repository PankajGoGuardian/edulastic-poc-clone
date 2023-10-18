import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'

const StyledRow = styled(Row)`
  padding: 23px 28px 13px 28px;
  background: white;
`

const ButtonsCol = styled(Col)`
  text-align: right;
`

export const PageHeader = ({ title, button }) => (
  <StyledRow>
    <Col span={12}>{title}</Col>
    <ButtonsCol span={12}>{button}</ButtonsCol>
  </StyledRow>
)
