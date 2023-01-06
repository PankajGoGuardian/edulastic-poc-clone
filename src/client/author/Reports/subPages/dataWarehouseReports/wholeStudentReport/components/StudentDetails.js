import React from 'react'
import { Icon } from 'antd'

import { themeColor, greyThemeDark2 } from '@edulastic/colors'
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
              <span data-testid="schoolName">{schoolName || '-'}</span>
            </div>
            <div>
              <span>Grade : </span>
              <span data-testid="grade">{grades || '-'}</span>
            </div>
            <div>
              <span>Race : </span>
              <span data-testid="race">{race || '-'}</span>
            </div>
            <div>
              <span>Gender : </span>
              <span data-testid="gender">{gender || '-'}</span>
            </div>
          </StudentMetaData>
        </Details>
      </DetailsWrapper>
      <Demographics>
        {frlStatus ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(frlStatus?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>FRL Status</span>
          </div>
        ) : null}
        {iepStatus ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(iepStatus?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>IEP Status</span>
          </div>
        ) : null}
        {ellStatus ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(ellStatus?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>ELL Status</span>
          </div>
        ) : null}
        {hispanicEthnicity ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(hispanicEthnicity?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>Hispanic Ethnicity</span>
          </div>
        ) : null}
      </Demographics>
    </div>
  )
}

export default StudentDetails
