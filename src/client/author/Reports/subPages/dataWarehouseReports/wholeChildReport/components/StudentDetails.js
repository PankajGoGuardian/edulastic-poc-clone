import React from 'react'

import { themeColor } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { IconCheckMark } from '@edulastic/icons'
import {
  DetailsWrapper,
  Details,
  StudentName,
  StyledIcon,
  StudentMetaData,
  StyledLine,
  Demographics,
  UserIcon,
} from '../common/styled'

const { getFormattedName } = reportUtils.common

const StudentDetails = ({
  studentInformation: {
    firstName = '',
    middleName = '',
    lastName = '',
    schoolName,
    grades,
    race,
    gender,
    iepStatus,
    frlStatus,
    ellStatus,
    hispanicEthnicity,
    thumbnail,
  },
}) => {
  const studentName = getFormattedName(
    `${firstName} ${middleName} ${lastName}`,
    false,
    true
  )

  return (
    <div>
      <DetailsWrapper>
        <Details>
          <StudentName>
            {thumbnail ? (
              <UserIcon src={thumbnail} />
            ) : (
              <StyledIcon data-testid="userIcon" />
            )}
            <span data-testid="studentName">{studentName}</span>
          </StudentName>
          <StyledLine />
          <StudentMetaData>
            <div>
              <span>School : </span>
              <span data-testid="schoolName">{schoolName}</span>
            </div>
            <div>
              <span>Grade : </span>
              <span data-testid="grade">{grades}</span>
            </div>
            <div>
              <span>Race : </span>
              <span data-testid="race">{race}</span>
            </div>
            <div>
              <span>Gender : </span>
              <span data-testid="gender">{gender}</span>
            </div>
          </StudentMetaData>
        </Details>
      </DetailsWrapper>
      <Demographics>
        {frlStatus === 'Yes' ? (
          <div className="demographic-item">
            <IconCheckMark color={themeColor} />
            <span>FRL Status</span>
          </div>
        ) : null}
        {iepStatus === 'Yes' ? (
          <div className="demographic-item">
            <IconCheckMark color={themeColor} />
            <span>IEP Status</span>
          </div>
        ) : null}
        {ellStatus === 'Yes' ? (
          <div className="demographic-item">
            <IconCheckMark color={themeColor} />
            <span>ELL Status</span>
          </div>
        ) : null}
        {hispanicEthnicity === 'Yes' ? (
          <div className="demographic-item">
            <IconCheckMark color={themeColor} />
            <span>Hispanic Ethnicity</span>
          </div>
        ) : null}
      </Demographics>
    </div>
  )
}

export default StudentDetails
