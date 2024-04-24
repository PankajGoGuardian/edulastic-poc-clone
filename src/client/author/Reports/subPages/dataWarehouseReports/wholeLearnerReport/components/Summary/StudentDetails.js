import React from 'react'
import { Tooltip } from 'antd'
import { reportUtils } from '@edulastic/constants'

import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { getGrades, getSchools } from '../../../../../common/util'
import {
  DetailsWrapper,
  StudentThumbnail,
  StyledIcon,
  StudentMetaData,
  UserIcon,
} from '../../common/styled'
import {
  GradeTooltipContent,
  IconInfoWithTooltip,
  SchoolTooltipContent,
} from '../../../../../common/components/tooltip/IconInfoWithTooltip'

const { formatName } = reportUtils.common

const StudentDetails = ({ studentInformation, studentClassData }) => {
  const { thumbnail } = studentInformation

  const studentName = formatName(studentInformation, { lastNameFirst: false })
  const { grade, gradesStr } = getGrades(studentClassData)
  const { schoolName, schoolsStr } = getSchools(studentClassData, grade.key)

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
          <span className="value" data-testid="grade">
            {grade.label || '-'}
          </span>
          <EduIf condition={!isEmpty(gradesStr)}>
            <IconInfoWithTooltip
              title={<GradeTooltipContent grades={gradesStr} />}
            />
          </EduIf>
        </div>
        <div className="schools-name">
          <span>School : </span>
          <Tooltip title={schoolName || ''}>
            <span className="value" data-testid="schoolName">
              {schoolName || '-'}
            </span>
          </Tooltip>
          <EduIf condition={!isEmpty(schoolsStr)}>
            <IconInfoWithTooltip
              title={<SchoolTooltipContent schools={schoolsStr} />}
            />
          </EduIf>
        </div>
      </StudentMetaData>
    </DetailsWrapper>
  )
}

export default StudentDetails
