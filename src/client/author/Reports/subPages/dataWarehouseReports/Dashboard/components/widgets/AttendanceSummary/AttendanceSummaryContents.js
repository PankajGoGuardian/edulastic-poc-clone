import React from 'react'
import {
  lightBrown,
  lightGrey8,
  lightGrey9,
  lightRed6,
} from '@edulastic/colors'
import { EduIf, EduThen, EduElse } from '@edulastic/common'
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

function AttendanceSummaryContents({ data, selectedPeriodType, showAbsents }) {
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
    value,
    changeValue,
    changeText,
    attendanceDisruptionsChange,
    chronicAbsentChange,
    fontColor,
  } = getAttendanceSummaryMetrics(prePeriod, postPeriod, showAbsents)

  return (
    <ContentWrapper>
      <WidgetCell
        header={showAbsents ? 'TOTAL ABSENCE' : 'AVERAGE'}
        value={value}
        dataCy="avgergeAttendancePercentage"
        cellType="large"
        color="#cef5d8"
      />
      <EduIf condition={showAvgTrend}>
        <div>
          <StyledText
            margin="0 10px 5px 10px"
            fontSize="18px"
            color={fontColor}
            data-cy="attendanceAvgChange"
          >
            {changeText}{' '}
            <EduIf condition={changeValue >= 0}>
              <EduThen>
                <StyledIconCaretUp color={fontColor} />
              </EduThen>
              <EduElse>
                <StyledIconCaretDown color={fontColor} />
              </EduElse>
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
        dataCy="attendanceDisruptionsPercentage"
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
        dataCy="chronicAbsenteeismPercentage"
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
