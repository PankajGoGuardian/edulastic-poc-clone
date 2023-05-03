import { darkGrey, grey } from '@edulastic/colors'
import { EduIf, FlexContainer } from '@edulastic/common'
import { IconInfo, IconStudent } from '@edulastic/icons'
import { Tooltip, Typography } from 'antd'
import React from 'react'
import { DashedLine } from '../../../../../common/styled'
import Legend from './Legend'
import IconArrow from '../../../../multipleAssessmentReport/PreVsPost/components/common/IconArrow'
import {
  StudentWrapper,
  SummaryWrapper,
  StyledCard,
  StyledTitle,
  TooltipWrapper,
} from '../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { TestTypeTag } from '../../common/styledComponents'

const SummaryContainer = ({
  summary,
  testInfo,
  totalStudentCount,
  prePerformanceBand,
  postPerformanceBand,
  preStudentCount,
  postStudentCount,
}) => {
  const { preCardInfo, postCardInfo, change } = summary
  const { preTestInfo, postTestInfo } = testInfo

  const preCardScorePostfix = `${preCardInfo.showPercent ? '%' : ''}`
  const postCardScorePostfix = `${postCardInfo.showPercent ? '%' : ''}`
  const changePostfix = `${
    postCardInfo.showPercent && preCardInfo.showPercent ? '%' : ''
  }`

  return (
    <>
      <FlexContainer marginBottom="20px" mt="20px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Avg Score Comparison
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
      </FlexContainer>

      <FlexContainer justifyContent="space-between">
        <StudentWrapper>
          <IconStudent className="icon-student" />
          <span className="student-count">
            GRADED IN BOTH PRE & POST: <span>{totalStudentCount}</span>
          </span>
          <Tooltip
            title={
              <TooltipWrapper>
                Graded in both Pre and Post: {totalStudentCount}
                <br />
                Total students in Pre: {preStudentCount}
                <br />
                Total students in Post: {postStudentCount}
              </TooltipWrapper>
            }
          >
            <IconInfo className="icon-info" />
          </Tooltip>
        </StudentWrapper>
        <div>
          <Legend band={prePerformanceBand} testType="PRE" />
          <Legend band={postPerformanceBand} testType="POST" />
        </div>
      </FlexContainer>
      <SummaryWrapper>
        <StyledCard>
          <Tooltip title={preTestInfo.name}>
            <StyledTitle color={preCardInfo.color}>
              <TestTypeTag>PRE</TestTypeTag>&nbsp;
              {preTestInfo.name}
            </StyledTitle>
          </Tooltip>
          <div className="value">
            <span>
              {preCardInfo.score}
              {preCardScorePostfix}
            </span>
            {preCardInfo.text}
          </div>
        </StyledCard>
        <StyledCard>
          <Tooltip title={postTestInfo.name}>
            <StyledTitle color={postCardInfo.color}>
              <TestTypeTag>POST</TestTypeTag>&nbsp;{postTestInfo.name}
            </StyledTitle>
          </Tooltip>
          <div className="value">
            <span>
              {postCardInfo.score}
              {postCardScorePostfix}
            </span>
            {postCardInfo.text}
          </div>
        </StyledCard>
        <EduIf condition={change !== null}>
          <StyledCard>
            <StyledTitle color={grey}>Change</StyledTitle>
            <div className="value">
              <span>
                <div data-testid="change">
                  {Math.abs(change)}
                  {changePostfix}
                </div>
                <IconArrow value={change} size="large" />
              </span>
            </div>
          </StyledCard>
        </EduIf>
      </SummaryWrapper>
    </>
  )
}

export default SummaryContainer
