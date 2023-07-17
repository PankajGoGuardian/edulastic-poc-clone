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
import { isEmpty, isNull } from 'lodash'
import { DashedLine } from '../../../../../../common/styled'
import { getTrendPeriodLabel } from '../../../../common/utils'
import {
  trendPeriodDateFormat,
  trendPeriodPrefix,
  getAttendanceSummaryMetrics,
} from '../../../utils'
import {
  ContentWrapper,
  StyledText,
  StyledIconCaretUp,
  StyledIconCaretDown,
} from '../../../../common/components/styledComponents'
import Footer from '../../../../common/components/Footer'
import WidgetCell from '../../../../common/components/WidgetCell'

function AttendanceSummaryContents({ data, selectedPeriodType }) {
  const {
    result: { postPeriod, prePeriod },
  } = data
  const showTrend = !isEmpty(prePeriod.start)
  const showAvgTrend = showTrend && !isNull(prePeriod.avg)
  const showAttendanceDisruptionsTrend =
    showTrend && !isNull(prePeriod.attendanceDisruptionsPerc)
  const showChronicTrend = showTrend && !isNull(prePeriod.chronicAbsentPerc)

  const trendPeriodLabel = showTrend
    ? getTrendPeriodLabel(
        selectedPeriodType,
        prePeriod,
        trendPeriodPrefix,
        trendPeriodDateFormat
      )
    : 0
  const {
    attendanceAvgChange,
    attendanceDisruptionsChange,
    chronicAbsentChange,
    fontColor,
  } = getAttendanceSummaryMetrics(prePeriod, postPeriod)

  return (
    <ContentWrapper>
      <WidgetCell
        header="AVERAGE"
        value={`${Math.round(postPeriod.avg)}%`}
        cellType="large"
        color="#cef5d8"
      />
      <EduIf condition={showAvgTrend}>
        <div>
          <StyledText
            margin="0 10px 5px 10px"
            fontSize="18px"
            color={fontColor}
          >
            {Math.abs(attendanceAvgChange)}%{' '}
            <EduIf condition={attendanceAvgChange >= 0}>
              <StyledIconCaretUp color={lightGreen12} />
            </EduIf>
            <EduIf condition={attendanceAvgChange < 0}>
              <StyledIconCaretDown color={lightRed7} />
            </EduIf>
          </StyledText>
          <StyledText fontSize="13px" color={lightGrey9}>
            {trendPeriodLabel}
          </StyledText>
        </div>
      </EduIf>
      <DashedLine
        dashWidth="1px"
        height="130px"
        maxWidth="1px"
        dashColor={lightGrey8}
        margin="0 10px"
      />
      <WidgetCell
        header="ATTENDANCE"
        subHeader="DISRUPTIONS"
        value={`${Math.round(postPeriod.attendanceDisruptionsPerc)}%`}
        footer={
          <Footer
            isVisible={showAttendanceDisruptionsTrend}
            value={attendanceDisruptionsChange}
            showPercentage
            showReverseTrend
          />
        }
        color={lightBrown}
      />
      <WidgetCell
        header="CHRONIC"
        subHeader="ABSENTEEISM"
        value={`${Math.round(postPeriod.chronicAbsentPerc)}%`}
        footer={
          <Footer
            isVisible={showChronicTrend}
            value={chronicAbsentChange}
            showPercentage
            showReverseTrend
          />
        }
        color={lightRed6}
      />
    </ContentWrapper>
  )
}

export default AttendanceSummaryContents
