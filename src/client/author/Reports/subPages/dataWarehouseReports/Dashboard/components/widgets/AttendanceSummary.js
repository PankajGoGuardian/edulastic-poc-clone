import { IconCarets } from '@edulastic/icons'
import React from 'react'
import { ContentWrapper, DashedVR, Widget } from '../common/styledComponents'
import WidgetCell from '../common/WidgetCell'
import WidgetHeader from '../common/WidgetHeader'

const title = 'ATTENDANCE SUMMARY'

const AttendanceSummary = ({ attendanceSummary }) => {
  const {
    avg,
    percentageIncreaseAvg,
    prevMonth,
    tardiesPercentage,
    chronicAbsentPercentage,
    percentageIncreaseTardies,
    percentageIncreaseChronic,
  } = attendanceSummary
  return (
    <Widget small>
      <WidgetHeader title={title} />
      <ContentWrapper>
        <WidgetCell header="AVG." value={`${avg}%`} largeCell color="#cef5d8" />
        <div className="large">
          {percentageIncreaseAvg}% <IconCarets.IconCaretUp />
          <div className="medium">since {prevMonth}</div>
        </div>
        <DashedVR height="150px" />
        <WidgetCell
          header="TARDIES"
          value={`${tardiesPercentage}%`}
          footer={`${percentageIncreaseTardies}`}
          color="#cef5d8"
        />
        <WidgetCell
          header="CHRONIC"
          subHeader="ABSENTEEISM"
          value={`${chronicAbsentPercentage}%`}
          footer={`${percentageIncreaseChronic}%`}
          color="#cef5d8"
        />
      </ContentWrapper>
    </Widget>
  )
}

export default AttendanceSummary
