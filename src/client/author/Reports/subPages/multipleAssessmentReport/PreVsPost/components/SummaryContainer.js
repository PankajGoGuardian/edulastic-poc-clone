import { percentage } from '@edulastic/constants/reportUtils/common'
import { Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { ArrowDown, ArrowUp } from '../common/styled'

const SummaryContainer = ({
  overallProficiency,
  preTestName,
  postTestName,
}) => {
  const {
    preTestAverageScore,
    preTestMaxScore,
    postTestAverageScore,
    postTestMaxScore,
  } = overallProficiency
  const preTestAvgPercentage = percentage(
    preTestAverageScore,
    preTestMaxScore,
    true
  )
  const postTestAvgPercentage = percentage(
    postTestAverageScore,
    postTestMaxScore,
    true
  )
  const change = postTestAvgPercentage - preTestAvgPercentage
  return (
    <Row justify="center" type="flex">
      <StyledCard>
        <StyledTitle>Pre: {preTestName}</StyledTitle>
        <StyledValue>
          <StyledSpan>{`${preTestAvgPercentage}%`}</StyledSpan>
          {` (${preTestAverageScore}/${preTestMaxScore})`}
        </StyledValue>
      </StyledCard>
      <StyledCard>
        <StyledTitle>Post: {postTestName}</StyledTitle>
        <StyledValue>
          <StyledSpan>{`${postTestAvgPercentage}%`}</StyledSpan>
          {` (${postTestAverageScore}/${postTestMaxScore})`}
        </StyledValue>
      </StyledCard>
      <StyledCard>
        <StyledTitle>Change</StyledTitle>
        <StyledValue>
          <StyledSpan>
            <div> {`${Math.abs(change)}%`}</div>
            {change < 0 ? (
              <ArrowDown large />
            ) : change > 0 ? (
              <ArrowUp large />
            ) : (
              ''
            )}
          </StyledSpan>
        </StyledValue>
      </StyledCard>
    </Row>
  )
}

const StyledCard = styled.div`
  width: 260px;
  height: 88px;
  border-radius: 4px;
  margin: 20px 50px;
  @media print {
    margin: 20px 10px;
  }
`
const StyledTitle = styled.div`
  height: 29px;
  background-color: #f8f8f8;
  border: 1px solid #b9b9b9;
  line-height: 29px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  align-items: center;
`
const StyledValue = styled.div`
  height: 59px;
  line-height: 59px;
  border: 1px solid #b9b9b9;
  text-align: center;
  font-size: 18px;
`
const StyledSpan = styled.span`
  font-weight: bold;
`

export default SummaryContainer
