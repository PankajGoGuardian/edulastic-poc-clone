import React from 'react'
import { Tooltip } from 'antd'
import { reportUtils } from '@edulastic/constants'

import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { getGrades, getSchools } from '../../../../../common/util'
import {
  DetailsWrapper,
  StudentThumbnail,
  StyledIcon,
  StudentMetaData,
  UserIcon,
} from '../../common/styled'

const { getFormattedName } = reportUtils.common

const StudentDetails = ({ studentInformation, studentClassData }) => {
  const {
    firstName = '',
    middleName = '',
    lastName = '',
    thumbnail,
  } = studentInformation

  const studentName = getFormattedName(
    `${firstName} ${middleName} ${lastName}`,
    false,
    true
  )
  const schoolName = getSchools(studentClassData) || '-'
  const grades = getGrades(studentClassData) || '-'

  return (
    <DetailsWrapper>
      <StudentThumbnail>
        <EduIf condition={!!thumbnail}>
          <EduThen>
            <UserIcon src={thumbnail} />
          </EduThen>
          <EduElse>
            <StyledIcon data-testid="userIcon" />
          </EduElse>
        </EduIf>
      </StudentThumbnail>
      <StudentMetaData>
        <div className="student-name">
          <span data-testid="studentName">{studentName}</span>
        </div>
        <div className="grades-name">
          <span>Grade : </span>
          <Tooltip title={grades}>
            <span className="value" data-testid="grade">
              {grades}
            </span>
          </Tooltip>
        </div>
        <div className="schools-name">
          <span>School : </span>
          <Tooltip title={schoolName}>
            <span className="value" data-testid="schoolName">
              {schoolName}
            </span>
          </Tooltip>
        </div>
      </StudentMetaData>
    </DetailsWrapper>
  )
}

export default StudentDetails
