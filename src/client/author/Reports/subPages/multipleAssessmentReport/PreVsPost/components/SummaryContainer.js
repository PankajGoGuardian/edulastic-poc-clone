import { percentage } from '@edulastic/constants/reportUtils/common'
import { Row } from 'antd'
import React from 'react'
import {
  ArrowDown,
  ArrowUp,
  StyledCard,
  StyledSpan,
  StyledTitle,
  StyledValue,
} from '../common/styled'

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

  // convert to avgScore to percentage
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

  const arrow =
    change < 0 ? <ArrowDown large /> : change > 0 ? <ArrowUp large /> : ''

  return (
    <Row justify="center" type="flex">
      <StyledCard>
        <StyledTitle>Pre: {preTestName}</StyledTitle>
        <StyledValue>
          <StyledSpan font="bold">{`${preTestAvgPercentage}%`}</StyledSpan>
          {` (${preTestAverageScore}/${preTestMaxScore})`}
        </StyledValue>
      </StyledCard>
      <StyledCard>
        <StyledTitle>Post: {postTestName}</StyledTitle>
        <StyledValue>
          <StyledSpan font="bold">{`${postTestAvgPercentage}%`}</StyledSpan>
          {` (${postTestAverageScore}/${postTestMaxScore})`}
        </StyledValue>
      </StyledCard>
      <StyledCard>
        <StyledTitle>Change</StyledTitle>
        <StyledValue>
          <StyledSpan font="bold">
            <div> {`${Math.abs(change)}%`}</div>
            {arrow}
          </StyledSpan>
        </StyledValue>
      </StyledCard>
    </Row>
  )
}

export default SummaryContainer
