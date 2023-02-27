import { lightGrey8 } from '@edulastic/colors'
import { IconCarets } from '@edulastic/icons'
import React from 'react'
import { DashedLine } from '../../../../../common/styled'
import {
  ContentWrapper,
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
    prevMonthAvg,
    prevMonth,
    tardiesPercentage,
    chronicAbsentPercentage,
    prevMonthtardiesPercentage,
    prevMonthChronicPercentage,
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
            {avg - prevMonthAvg}% <IconCarets.IconCaretUp />
          </Footer>
          <SubFooter font="13px">since {prevMonth}</SubFooter>
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
          footer={`${tardiesPercentage - prevMonthtardiesPercentage}%`}
          color="#cef5d8"
          cellType="small"
        />
        <WidgetCell
          header="CHRONIC"
          subHeader="ABSENTEEISM"
          value={`${chronicAbsentPercentage}%`}
          footer={`${chronicAbsentPercentage - prevMonthChronicPercentage}%`}
          color="#cef5d8"
          cellType="small"
        />
      </ContentWrapper>
    </Widget>
  )
}

export default AttendanceSummary
