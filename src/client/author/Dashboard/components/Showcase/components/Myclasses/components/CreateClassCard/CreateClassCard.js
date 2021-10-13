import React from 'react'
import { IconPlusCircle } from '@edulastic/icons'
import { title } from '@edulastic/colors'

import {
  CreateClassCardWrapper,
  CreateClassTitle,
  InfoText,
  StyledEduButton,
  Text,
} from './styled'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton/index'
import { TextWrapper } from '../../../../../styledComponents'

const CreateClassCard = ({ history, newCreateClassCard }) => {
  const createNewClass = () => {
    history.push({
      pathname: '/author/manageClass/createClass',
      state: { fromDashboard: true },
    })
  }

  return (
    <>
      <CreateClassCardWrapper newCreateClassCard={newCreateClassCard}>
        <CreateClassTitle>Create Class</CreateClassTitle>
        <InfoText>
          Create class and add students or import your classes
        </InfoText>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <StyledEduButton
              isBlue
              data-cy="createNewClass"
              onClick={handleClick}
            >
              <IconPlusCircle width={16} height={16} />{' '}
              <Text>CREATE A CLASS </Text>
            </StyledEduButton>
          )}
          onClick={createNewClass}
        />
      </CreateClassCardWrapper>
    </>
  )
}

export default CreateClassCard
