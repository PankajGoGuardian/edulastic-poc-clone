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
  width: -webkit-fill-available;
  align-items: center;
  justify-content: center;
`
export default MoreReportsContainer
