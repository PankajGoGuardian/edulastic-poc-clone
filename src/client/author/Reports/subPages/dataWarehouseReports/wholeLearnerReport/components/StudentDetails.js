import React from 'react'
import { Icon, Tooltip } from 'antd'

import { themeColor, greyThemeDark2 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { IconCheckMark } from '@edulastic/icons'
import { getGrades, getSchools } from '../../../../common/util'
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
    race,
    gender,
    iepStatus,
    frlStatus,
    ellStatus,
    hispanicEthnicity,
    thumbnail,
  },
  studentClassData,
}) => {
  const studentName = getFormattedName(
    `${firstName} ${middleName} ${lastName}`,
    false,
    true
  )

  const schoolName = getSchools(studentClassData)
  const grades = getGrades(studentClassData)

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
            <div className="schools-name">
              <span>School : </span>
              <Tooltip title={schoolName}>
                <span data-testid="schoolName">{schoolName || '-'}</span>
              </Tooltip>
            </div>
            <div className="grades-name">
              <span>Grade : </span>
              <Tooltip title={grades}>
                <span data-testid="grade">{grades || '-'}</span>
              </Tooltip>
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
