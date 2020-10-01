import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'
import { StyledCard, StyledH3 } from '../styled'

export const EmptyData = () => {
  return (
    <EmptyDataContainer>
      <StyledCard>
        <StyledH3>No data available currently.</StyledH3>
      </StyledCard>
    </EmptyDataContainer>
  )
}

const EmptyDataContainer = styled(Col)`
  h3 {
    font-size: 25px;
  }
`
