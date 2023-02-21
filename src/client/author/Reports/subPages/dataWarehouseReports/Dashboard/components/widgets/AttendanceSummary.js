import { IconCarets, IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { ContentWrapper, DashedVR, Widget } from '../common/styledComponents'
import WidgetCell from '../common/WidgetCell'

const title = 'ATTENDANCE SUMMARY'

const AttendanceSummary = () => {
  return (
    <Widget small>
      <div>
        <span className="title">{title}</span>
        <span className="external-link">
          <IconExternalLink />
        </span>
      </div>
      <ContentWrapper>
        <WidgetCell header="AVG." value="67%" largeCell color="#cef5d8" />
        <div className="large">
          13% <IconCarets.IconCaretUp />
          <div className="medium">since 1st Dec.</div>
        </div>
        <DashedVR height="150px" />
        <WidgetCell header="TARDIES" value="12%" footer="26%" color="#cef5d8" />
        <WidgetCell
          header="CHRONIC"
          subHeader="ABSENTEEISM"
          value="12%"
          footer="26%"
          color="#cef5d8"
        />
      </ContentWrapper>
    </Widget>
  )
}

export default AttendanceSummary
