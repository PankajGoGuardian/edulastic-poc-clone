import React from 'react'
import { getCompletionReportPathForAssignment } from '../../../../../../Assignments/components/ActionMenu/ActionMenu'
import { TitleCopy } from '../../../../../../TutorMe/components/styled'

const CopyReportLink = ({ report, filterSettings, compareBy = {} }) => {
  return (
    <TitleCopy
      copyable={{
        text: `${
          window.location.origin
        }/author/reports/completion-report${getCompletionReportPathForAssignment(
          report.testId,
          {},
          [report],
          filterSettings,
          compareBy
        )}`,
      }}
    />
  )
}

export default CopyReportLink
