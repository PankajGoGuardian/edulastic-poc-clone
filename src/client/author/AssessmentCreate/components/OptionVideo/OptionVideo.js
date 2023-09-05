import { EduButton } from '@edulastic/common'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { segmentApi } from '@edulastic/api'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import QuickTour from '../QuickTour/QuickTour'
import { SnapQuiz } from './styled'

const QUICK_TOUR_LINK = `//fast.wistia.net/embed/iframe/jd8y6sdt1m`
const descriptionBottom = `
  Provide your video link and proceed to create an Edulastic Assessment
`

const OptionVideo = ({ history }) => {
  const handleCreate = () => {
    segmentApi.genericEventTrack('VideoQuizCreateTestClick', {})
    history.push({
      pathname: '/author/tests/videoquiz',
    })
  }
  return (
    <CardComponent>
      <SnapQuiz>
        <span>Video</span>Quiz
      </SnapQuiz>
      <TitleWrapper>Create from Video</TitleWrapper>
      <TextWrapper>{descriptionBottom}</TextWrapper>

      <EduButton
        onClick={handleCreate}
        data-cy="createTest"
        isGhost
        width="180px"
      >
        Create test
      </EduButton>
      <QuickTour
        title="Get Started with VideoQuiz"
        quickTourLink={QUICK_TOUR_LINK}
      />
    </CardComponent>
  )
}

export default withRouter(OptionVideo)
