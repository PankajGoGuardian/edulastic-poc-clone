import { darkGrey, grey } from '@edulastic/colors'
import { percentage } from '@edulastic/constants/reportUtils/common'
import { IconInfo, IconStudent } from '@edulastic/icons'
import { Tooltip, Typography } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { DashedLine } from '../../../../../common/styled'
import { getProficiencyBand } from '../../../../../common/util'
import {
  StudentWrapper,
  SummaryWrapper,
  StyledCard,
  StyledTitle,
  StyledContainer,
  TestTypeTag,
  StyledRow,
  TooltipWrapper,
} from '../../common/styledComponents'
import IconArrow from '../common/IconArrow'
import PreVsPostLegend from './Legend'
import { GridContainer } from '../../../../dataWarehouseReports/EfficacyReport/common/styledComponents'

const SummaryContainer = ({
  summary,
  preTestName,
  postTestName,
  preStudentCount,
  postStudentCount,
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

  return (
    <>
      <StyledRow type="flex" margin="-18px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Avg Score Comparison
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
      </StyledRow>

      <StyledContainer>
        <StudentWrapper>
          <IconStudent className="icon-student" />
          <span className="student-count">
            GRADED IN BOTH PRE & POST: <span>{totalStudentCount}</span>
          </span>
          <Tooltip
            title={
              <TooltipWrapper>
                <GridContainer>
                  <span>Graded in both Pre and Post:</span>
                  <span>{totalStudentCount}</span>
                  <span>Total students in Pre:</span>
                  <span>{preStudentCount}</span>
                  <span>Total students in Post:</span>
                  <span>{postStudentCount}</span>
                </GridContainer>
              </TooltipWrapper>
            }
          >
            <IconInfo className="icon-info" />
          </Tooltip>
        </StudentWrapper>
        <PreVsPostLegend selectedPerformanceBand={selectedPerformanceBand} />
      </StyledContainer>
      <SummaryWrapper>
        <StyledCard>
          <Tooltip title={preTestName}>
            <StyledTitle color={preTestAvgBandColor}>
              <TestTypeTag>PRE</TestTypeTag>&nbsp;
              {preTestName}
            </StyledTitle>
          </Tooltip>
          <div className="value">
            <span>{preTestAvgPercentage}%</span>
            {` (${preTestAverageScore}/${preTestMaxScore})`}
          </div>
        </StyledCard>
        <StyledCard>
          <Tooltip title={postTestName}>
            <StyledTitle color={postTestAvgBandColor}>
              <TestTypeTag>POST</TestTypeTag>&nbsp;{postTestName}
            </StyledTitle>
          </Tooltip>
          <div className="value">
            <span>{postTestAvgPercentage}%</span>
            {` (${postTestAverageScore}/${postTestMaxScore})`}
          </div>
        </StyledCard>
        <StyledCard>
          <StyledTitle color={grey}>Change</StyledTitle>
          <div className="value">
            <span>
              <div data-testid="change"> {Math.abs(change)}%</div>
              <IconArrow value={change} size="large" />
            </span>
          </div>
        </StyledCard>
      </SummaryWrapper>
    </>
  )
}

export default SummaryContainer
