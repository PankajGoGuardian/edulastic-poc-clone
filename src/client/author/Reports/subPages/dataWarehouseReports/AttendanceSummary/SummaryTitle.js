import React from 'react'
import { helpLinks, reportNavType } from '@edulastic/constants/const/report'
import SectionDescription from '../../../common/components/SectionDescription'
import SectionLabel from '../../../common/components/SectionLabel'

const SummaryTitle = () => {
  return (
    <>
      <SectionLabel
        style={{ fontSize: '20px' }}
        $margin="30px 0px 10px 0px"
        showHelp
        url={helpLinks[reportNavType.DW_ATTENDANCE_SUMMARY_REPORT]}
      >
        Attendance Summary
      </SectionLabel>
      <SectionDescription $margin="0px 0px 30px 0px">
        Monitor attendance and tardies, identify the students at risk of chronic
        absenteeism, and intervene.
      </SectionDescription>
    </>
  )
}
export default SummaryTitle
