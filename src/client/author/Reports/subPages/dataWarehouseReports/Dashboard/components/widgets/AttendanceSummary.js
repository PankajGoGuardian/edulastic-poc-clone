import { IconCarets } from '@edulastic/icons'
import React from 'react'
import {
  ContentWrapper,
  DashedVR,
  Footer,
  SubFooter,
  Widget,
} from '../common/styledComponents'
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
        <WidgetCell
          header="AVG."
          value={`${avg}%`}
          cellType="large"
          color="#cef5d8"
        />
        <div>
          <Footer margin="5px">
            {percentageIncreaseAvg}% <IconCarets.IconCaretUp />
          </Footer>
          <SubFooter font="13px">since {prevMonth}</SubFooter>
        </div>
        <DashedVR height="150px" />
        <div className="right-content">
          <WidgetCell
            header="TARDIES"
            value={`${tardiesPercentage}%`}
            footer={`${percentageIncreaseTardies}`}
            color="#cef5d8"
            cellType="small"
          />
          <WidgetCell
            header="CHRONIC"
            subHeader="ABSENTEEISM"
            value={`${chronicAbsentPercentage}%`}
            footer={`${percentageIncreaseChronic}%`}
            color="#cef5d8"
            cellType="small"
          />
        </div>
      </ContentWrapper>
    </Widget>
  )
}

export default AttendanceSummary
