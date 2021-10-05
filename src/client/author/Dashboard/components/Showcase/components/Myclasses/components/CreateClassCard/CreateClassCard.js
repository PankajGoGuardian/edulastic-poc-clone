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

const CreateClassCard = ({ history }) => {
  const createNewClass = () => history.push('/author/manageClass/createClass')

  return (
    <>
      <TextWrapper
        fw="bold"
        rfs="18px"
        color={title}
        style={{ marginTop: '1rem' }}
      >
        Get Started with Edulastic
      </TextWrapper>
      <CreateClassCardWrapper>
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
