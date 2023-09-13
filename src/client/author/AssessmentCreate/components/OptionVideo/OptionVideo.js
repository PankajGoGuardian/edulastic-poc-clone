import { EduButton } from '@edulastic/common'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { segmentApi } from '@edulastic/api'
import styled from 'styled-components'
import { lightGrey4 } from '@edulastic/colors'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import QuickTour from '../QuickTour/QuickTour'
import { SnapQuiz } from './styled'
import FreeVideoQuizAnnouncement from '../common/FreeVideoQuizAnnouncement'
import { checkIsDateLessThanSep30 } from '../../../TestPage/utils'

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
  const isDateLessThanSep30 = checkIsDateLessThanSep30()
  return (
    <CardComponent>
      {isDateLessThanSep30 && (
        <ExpiryTextContainer>
          <FreeVideoQuizAnnouncement
            title="Free to use till September 30"
            history={history}
            style={{ padding: '20px 10px 0px 10px' }}
          />
          <StyledDivider />
        </ExpiryTextContainer>
      )}
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

export const ExpiryTextContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
`
export const StyledDivider = styled.div`
  border: 1.2px solid ${lightGrey4};
  width: 110%;
  margin: 8px 0px;
`
