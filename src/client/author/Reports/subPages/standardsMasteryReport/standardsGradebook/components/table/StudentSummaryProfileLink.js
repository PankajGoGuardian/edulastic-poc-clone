import React from 'react'
import { Link } from 'react-router-dom'

const StudentSummaryProfileLink = ({ termId, studentId, studentName }) => (
  <Link
    to={`/author/reports/student-profile-summary/student/${studentId}?termId=${termId}`}
  >
    {studentName}
  </Link>
)

export default StudentSummaryProfileLink
