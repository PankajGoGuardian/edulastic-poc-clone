import { EduButton } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import IconWrapper from '../../../AssignmentCreate/common/IconWrapper'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { FlashQuiz } from './styled'

const OptionFlash = () => (
  <CardComponent ml="25px">
    <IconWrapper>
      <FlashQuiz>
        <span>Flash</span>Quiz
      </FlashQuiz>
    </IconWrapper>
    <TitleWrapper>Create from Flash Cards</TitleWrapper>

    <TextWrapper>
      Gamify assesments by creating intiutive learning experience using Flash
      Cards and Flip Cards
    </TextWrapper>
    <Link to="/author/flashquiz/create">
      <EduButton data-cy="createFlashTest" isGhost width="234px">
        CREATE TEST
      </EduButton>
    </Link>
  </CardComponent>
)

export default OptionFlash
