import React from 'react'

import { reportUtils } from '@edulastic/constants'
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
  StyledCheckedIcon,
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
        <div>
          <StyledCheckedIcon
            type="check-circle"
            theme="filled"
            checked={frlStatus}
          />
          <p>FRL Status</p>
        </div>
        <div>
          <StyledCheckedIcon
            type="check-circle"
            theme="filled"
            checked={iepStatus}
          />
          <p>IEP Status</p>
        </div>
        <div>
          <StyledCheckedIcon
            type="check-circle"
            theme="filled"
            checked={ellStatus}
          />
          <p>ELL Status</p>
        </div>
        <div>
          <StyledCheckedIcon
            type="check-circle"
            theme="filled"
            checked={hispanicEthnicity}
          />
          <p>Hispanic Ethnicity</p>
        </div>
      </Demographics>
    </div>
  )
}

export default StudentDetails
