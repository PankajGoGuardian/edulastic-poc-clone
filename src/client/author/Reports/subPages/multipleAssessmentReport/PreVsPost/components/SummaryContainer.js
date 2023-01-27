import { darkGrey, grey } from '@edulastic/colors'
import { percentage } from '@edulastic/constants/reportUtils/common'
import { IconInfo, IconStudent } from '@edulastic/icons'
import { Tooltip, Typography, Row } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { DashedLine } from '../../../../common/styled'
import { getProficiencyBand } from '../../../../common/util'
import {
  ArrowLarge as Arrow,
  StudentWrapper,
  SummaryWrapper,
  StyledCard,
  StyledTitle,
  TooltipWrapper,
  StyledContainer,
} from '../common/styled'
import PreVsPostLegend from './Legend'

const SummaryContainer = ({
  summary,
  preTestName,
  postTestName,
  totalStudentCount,
  selectedPerformanceBand,
}) => {
  const {
    preTestAverageScore,
    preTestMaxScore,
    postTestAverageScore,
    postTestMaxScore,
  } = summary

  // get pre test info
  const preTestAvgPercentage = percentage(
    preTestAverageScore,
    preTestMaxScore,
    true
  )
  const preTestAvgBand = getProficiencyBand(
    preTestAvgPercentage,
    selectedPerformanceBand
  )
  const preTestAvgBandColor = get(preTestAvgBand, 'color')

  // get post test info
  const postTestAvgPercentage = percentage(
    postTestAverageScore,
    postTestMaxScore,
    true
  )
  const postTestAvgBand = getProficiencyBand(
    postTestAvgPercentage,
    selectedPerformanceBand
  )
  const postTestAvgBandColor = get(postTestAvgBand, 'color')

  const change = postTestAvgPercentage - preTestAvgPercentage

  const arrow =
    change < 0 ? (
      <Arrow type="top" />
    ) : change > 0 ? (
      <Arrow type="bottom" />
    ) : (
      ''
    )

  const tooltipText = (
    <TooltipWrapper>
      STUDENTS THAT HAVE RESULT FOR BOTH ASSESSMENTS
    </TooltipWrapper>
  )

  return (
    <>
      <Row type="flex" style={{ marginTop: '20px' }}>
        <Typography.Title style={{ margin: 0 }} level={4}>
          Avg Score Comparison
        </Typography.Title>
        <DashedLine dashColor={darkGrey} />
      </Row>

      <StyledContainer>
        <StudentWrapper>
          <IconStudent className="icon-student" />
          <span className="student-count">ATTEMPTED: {totalStudentCount}</span>
          <Tooltip title={tooltipText}>
            <IconInfo className="icon-info" />
          </Tooltip>
        </StudentWrapper>
        <PreVsPostLegend selectedPerformanceBand={selectedPerformanceBand} />
      </StyledContainer>
      <SummaryWrapper>
        <StyledCard>
          <Tooltip title={preTestName}>
            <StyledTitle color={preTestAvgBandColor}>
              Pre: {preTestName}
            </StyledTitle>
          </Tooltip>
          <div className="value">
            <span>{`${preTestAvgPercentage}%`}</span>
            {` (${preTestAverageScore}/${preTestMaxScore})`}
          </div>
        </StyledCard>
        <StyledCard>
          <Tooltip title={postTestName}>
            <StyledTitle color={postTestAvgBandColor}>
              Post: {postTestName}
            </StyledTitle>
          </Tooltip>
          <div className="value">
            <span>{`${postTestAvgPercentage}%`}</span>
            {` (${postTestAverageScore}/${postTestMaxScore})`}
          </div>
        </StyledCard>
        <StyledCard>
          <StyledTitle color={grey}>Change</StyledTitle>
          <div className="value">
            <span>
              <div> {`${Math.abs(change)}%`}</div>
              {arrow}
            </span>
          </div>
        </StyledCard>
      </SummaryWrapper>
    </>
  )
}

export default SummaryContainer
