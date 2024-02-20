import React from 'react'
import { white } from '@edulastic/colors'
import PropTypes from 'prop-types'
import IconPearAssessmentLogo from '@edulastic/icons/src/IconPearAssessmentLogo'
import {
  StyledCard,
  BoldText,
  ParaP,
  StudnetName,
  UserInfo,
  PrintLogoContainer,
} from './styled'

const StudentCard = ({
  student: { firstName, lastName, email, username },
  code,
  appLoginUrl,
}) => {
  const name = [firstName, lastName].filter((n) => n).join(' ')

  return (
    <StyledCard>
      <PrintLogoContainer bgColor={white} align="center">
        <IconPearAssessmentLogo height="45" width="200" />
      </PrintLogoContainer>
      <ParaP>
        <BoldText>Student Name</BoldText>
      </ParaP>
      <ParaP>
        <StudnetName>{name} </StudnetName>
      </ParaP>
      <UserInfo>
        <div>
          <BoldText>Username: </BoldText> <span>{username || email}</span>
        </div>
        <div>
          <BoldText>Password: </BoldText> <span>{code}</span>
        </div>
      </UserInfo>
      <ParaP>
        <a href={appLoginUrl}>{appLoginUrl}</a>
      </ParaP>
    </StyledCard>
  )
}

StudentCard.propTypes = {
  student: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
}

export default StudentCard
