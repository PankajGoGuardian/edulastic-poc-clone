import {
  lightGreen12,
  lightGrey8,
  lightGrey9,
  lightRed5,
} from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { Spin } from 'antd'
import React from 'react'
import { DashedLine } from '../../../../../common/styled'
import {
  ContentWrapper,
  StyledText,
  Widget,
  StyledIconCaretUp,
  StyledIconCaretDown,
} from '../common/styledComponents'
import WidgetCell from './common/WidgetCell'
import WidgetHeader from './common/WidgetHeader'

const title = 'ATTENDANCE SUMMARY'

const AttendanceSummary = ({
  attendanceSummaryData,
  loadingAttendanceSummaryData,
}) => {
  const {
    avg,
    prevMonthAvg,
    tardiesPercentage,
    chronicAbsentPercentage,
    prevMonthtardiesPercentage,
    prevMonthChronicPercentage,
  } = attendanceSummaryData
  const attendanceAvgIncrease = avg - prevMonthAvg
  const fontColor = attendanceAvgIncrease >= 0 ? lightGreen12 : lightRed5
  return (
    <Widget small>
      <Spin spinning={loadingAttendanceSummaryData}>
        <WidgetHeader title={title} />
        <EduIf condition={!loadingAttendanceSummaryData}>
          <ContentWrapper>
            <WidgetCell value={`${avg}%`} cellType="large" color="#cef5d8" />
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
                vs Dec&apos;22
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
        </EduIf>
      </Spin>
    </Widget>
  )
}

export default AttendanceSummary
