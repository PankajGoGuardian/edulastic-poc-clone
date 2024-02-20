import React from 'react'
import { getCompletionReportPathForAssignment } from '../../../../../../Assignments/components/ActionMenu/ActionMenu'
import { TitleCopy } from '../../../../../../TutorMe/components/styled'

const CopyReportLink = ({ report, filterSettings }) => {
  return (
    <TitleCopy
      copyable={{
        text: `${
          window.location.origin
        }/author/reports/completion-report${getCompletionReportPathForAssignment(
          report.testId,
          {},
          [report],
          filterSettings
        )}`,
      }}
    />
  )
}

export default CopyReportLink
