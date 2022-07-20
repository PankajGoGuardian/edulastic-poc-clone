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

const CreateClassCard = ({
  newCreateClassCard,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
}) => {
  const createNewClass = () => {
    setShowClassCreationModal(true)
    setCreateClassTypeDetails({ type: 'class', fromDashboard: true })
  }

  return (
    <>
      <CreateClassCardWrapper newCreateClassCard={newCreateClassCard}>
        <CreateClassTitle data-cy="classCreationTitle">
          Create Class
        </CreateClassTitle>
        <InfoText>
          Use <b> Google Classroom </b> to import class(es) or create manually
        </InfoText>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <StyledEduButton
              isBlue
              data-cy="createNewClassFromCard"
              onClick={handleClick}
            >
              <IconPlusCircle width={16} height={16} />{' '}
              <Text>CREATE A CLASS </Text>
            </StyledEduButton>
          )}
          onClick={createNewClass}
          triggerSource="Create Class"
        />
      </CreateClassCardWrapper>
    </>
  )
}

export default CreateClassCard
