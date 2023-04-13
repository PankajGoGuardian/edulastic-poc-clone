import React from 'react'
import {
  lightBrown,
  lightGreen12,
  lightGrey8,
  lightGrey9,
  lightRed7,
  lightRed6,
} from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { DashedLine } from '../../../../../../common/styled'
import {
  ContentWrapper,
  StyledText,
  StyledIconCaretUp,
  StyledIconCaretDown,
} from '../../common/styledComponents'
import WidgetCell from '../common/WidgetCell'
import { getTrendPeriodLabel } from '../../../../common/utils'
import { trendPeriodDateFormat, trendPeriodPrefix } from '../../../utils'

function AttendanceSummaryContents({ data, selectedPeriodType }) {
  const { result } = data
  const attendanceAvgIncrease = Math.round(
    result.postPeriod.avg - result.prePeriod.avg
  )
  const fontColor = attendanceAvgIncrease >= 0 ? lightGreen12 : lightRed7
  const trendPeriodLabel = getTrendPeriodLabel(
    selectedPeriodType,
    result.postPeriod,
    trendPeriodPrefix,
    trendPeriodDateFormat
  )
  return (
    <ContentWrapper>
      <WidgetCell
        subHeader="AVG."
        value={`${Math.round(result.postPeriod.avg)}%`}
        cellType="large"
        color="#cef5d8"
      />
      <div>
        <StyledText margin="0 10px 5px 10px" fontSize="18px" color={fontColor}>
          {Math.abs(attendanceAvgIncrease)}%{' '}
          <EduIf condition={attendanceAvgIncrease >= 0}>
            <StyledIconCaretUp color={lightGreen12} />
          </EduIf>
          <EduIf condition={attendanceAvgIncrease < 0}>
            <StyledIconCaretDown color={lightRed7} />
          </EduIf>
        </StyledText>
        <StyledText fontSize="13px" color={lightGrey9}>
          {trendPeriodLabel}
        </StyledText>
      </div>
      <DashedLine
        dashWidth="1px"
        height="130px"
        maxWidth="1px"
        dashColor={lightGrey8}
        margin="0 10px"
      />
      <WidgetCell
        header="TARDIES"
        value={`${Math.round(result.postPeriod.tardiesPerc)}%`}
        footer={Math.round(
          result.postPeriod.tardiesPerc - result.prePeriod.tardiesPerc
        )}
        color={lightBrown}
        cellType="small"
      />
      <WidgetCell
        header="CHRONIC"
        subHeader="ABSENTEEISM"
        value={`${Math.round(result.postPeriod.chronicAbsentPerc)}%`}
        footer={Math.round(
          result.postPeriod.chronicAbsentPerc -
            result.prePeriod.chronicAbsentPerc
        )}
        color={lightRed6}
        cellType="small"
      />
    </ContentWrapper>
  )
}
export default AttendanceSummaryContents
