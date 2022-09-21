import React from 'react'

import { themeColor } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { IconCheckMark } from '@edulastic/icons'
import {
  DetailsWrapper,
  Details,
  StudentName,
  StyledIcon,
  StyledTitle,
  StudentMetaData,
  StyledFont,
  StyledLine,
  Demographics,
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
            <StyledIcon data-testid="userIcon" />
            <StyledTitle data-testid="studentName">{studentName}</StyledTitle>
          </StudentName>
          <StyledLine />
          <StudentMetaData>
            <div>
              <StyledFont>School : </StyledFont>
              <StyledTitle data-testid="schoolName">{schoolName}</StyledTitle>
            </div>
            <div>
              <StyledFont>Grade : </StyledFont>
              <StyledTitle data-testid="grade">{grades}</StyledTitle>
            </div>
            <div>
              <StyledFont>Race : </StyledFont>
              <StyledTitle data-testid="race">{race}</StyledTitle>
            </div>
            <div>
              <StyledFont>Gender : </StyledFont>
              <StyledTitle data-testid="gender">{gender}</StyledTitle>
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
