import React from 'react'
import { IconPlusCircle } from '@edulastic/icons'

import {
  CreateClassCardWrapper,
  CreateClassTitle,
  InfoText,
  StyledEduButton,
  Text,
} from './styled'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton/index'

const CreateAssignmentCard = ({ history, newCreateClassCard }) => {
  const createNewAssignment = () => {
    history.push({
      pathname: '/author/assignments/select',
      state: { fromDashboard: true },
    })
  }

  return (
    <>
      <CreateClassCardWrapper newCreateClassCard={newCreateClassCard}>
        <CreateClassTitle data-cy="asignmentCreationTitle">
          Create Assignment
        </CreateClassTitle>
        <InfoText>
          Select from a library of <b> 200K pre-built assessment </b> or create
          your own
        </InfoText>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <StyledEduButton
              isBlue
              data-cy="createNewAssignment"
              onClick={handleClick}
            >
              <IconPlusCircle width={16} height={16} />{' '}
              <Text>CREATE ASSIGNMENT </Text>
            </StyledEduButton>
          )}
          onClick={createNewAssignment}
          triggerSource={'Create Assignment'}
        />
      </CreateClassCardWrapper>
    </>
  )
}

export default CreateAssignmentCard
