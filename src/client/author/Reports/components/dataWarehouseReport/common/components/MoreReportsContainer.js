import React from 'react'
import styled from 'styled-components'
import { Card } from 'antd'
import { IconMoreReports } from '@edulastic/icons'

const MoreReportsContainer = () => {
  return (
    <StyledCard>
      <IconMoreReports />
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  display: flex;
  border-radius: 10px;
  height: 600px;
  margin: 0 10px;
  align-items: center;
  justify-content: center;
  flex-basis: 0;
  flex-grow: 1;
`
export default MoreReportsContainer
