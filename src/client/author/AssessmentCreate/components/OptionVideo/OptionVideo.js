import { EduButton } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import QuickTour from '../QuickTour/QuickTour'
import { SnapQuiz } from './styled'

const QUICK_TOUR_LINK = `//fast.wistia.net/embed/iframe/na92pypvxo`
const descriptionBottom = `
  Provide your video link and proceed to create an Edulastic Assessment
`

const OptionVideo = () => (
  <CardComponent>
    <SnapQuiz>
      <span>Video</span>Quiz
    </SnapQuiz>
    <TitleWrapper>Create from Video</TitleWrapper>
    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to="/author/tests/videoquiz">
      <EduButton data-cy="createTest" isGhost width="180px">
        Create test
      </EduButton>
    </Link>
    <QuickTour
      title="Get Started with VideoQuiz"
      quickTourLink={QUICK_TOUR_LINK}
    />
  </CardComponent>
)

export default OptionVideo
