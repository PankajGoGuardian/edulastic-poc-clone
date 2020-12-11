import React from 'react'
import Row from "antd/es/Row";
import Col from "antd/es/Col";
import styled from 'styled-components'

export const BoxHeading = ({ heading }) => (
  <StyledRow type="flex" justify="start">
    <StyledCol>
      <StyledH3>{heading}</StyledH3>
    </StyledCol>
  </StyledRow>
)

const StyledRow = styled(Row)`
  margin-bottom: 20px;
`

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
`

const StyledH3 = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #4a5263;
  margin: 0px;
`
