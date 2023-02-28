import {
  lightGreen12,
  lightGrey8,
  lightGrey9,
  lightRed5,
} from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import React from 'react'
import { DashedLine } from '../../../../../common/styled'
import {
  ContentWrapper,
  StyledText,
  Widget,
  StyledIconCaretUp,
  StyledIconCaretDown,
} from '../common/styledComponents'
import WidgetCell from '../common/WidgetCell'
import WidgetHeader from '../common/WidgetHeader'

const title = 'ATTENDANCE SUMMARY'

const AttendanceSummary = ({ attendanceSummary }) => {
  const {
    avg,
    prevMonthAvg,
    prevMonth,
    tardiesPercentage,
    chronicAbsentPercentage,
    prevMonthtardiesPercentage,
    prevMonthChronicPercentage,
  } = attendanceSummary
  const attendanceAvgIncrease = avg - prevMonthAvg
  const fontColor = attendanceAvgIncrease >= 0 ? lightGreen12 : lightRed5
  return (
    <Widget small>
      <WidgetHeader title={title} />
      <ContentWrapper>
        <WidgetCell
          header="AVG."
          value={`${avg}%`}
          cellType="large"
          color="#cef5d8"
        />
        <div>
          <StyledText
            margin="0 10px 5px 10px"
            fontSize="18px"
            color={fontColor}
          >
            {attendanceAvgIncrease}%{' '}
            <EduIf condition={attendanceAvgIncrease >= 0}>
              <StyledIconCaretUp color={lightGreen12} />
            </EduIf>
            <EduIf condition={attendanceAvgIncrease < 0}>
              <StyledIconCaretDown color={lightRed5} />
            </EduIf>
          </StyledText>
          <StyledText fontSize="13px" color={lightGrey9}>
            since {prevMonth}
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
          value={`${tardiesPercentage}%`}
          footer={tardiesPercentage - prevMonthtardiesPercentage}
          color="#cef5d8"
          cellType="small"
        />
        <WidgetCell
          header="CHRONIC"
          subHeader="ABSENTEEISM"
          value={`${chronicAbsentPercentage}%`}
          footer={chronicAbsentPercentage - prevMonthChronicPercentage}
          color="#cef5d8"
          cellType="small"
        />
      </ContentWrapper>
    </Widget>
  )
}

export default AttendanceSummary
