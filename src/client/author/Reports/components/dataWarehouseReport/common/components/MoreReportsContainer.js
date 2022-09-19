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
  width: 1500px;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
`
export default MoreReportsContainer
