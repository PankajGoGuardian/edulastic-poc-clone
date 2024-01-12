import { EduButton, EduIf, FlexContainer } from '@edulastic/common'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { segmentApi } from '@edulastic/api'
import styled from 'styled-components'
import { lightGrey4 } from '@edulastic/colors'
import { compose } from 'redux'
import { connect } from 'react-redux'
import i18 from '@edulastic/localization'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import QuickTour from '../QuickTour/QuickTour'
import { SnapQuiz } from './styled'
import FreeVideoQuizAnnouncement from '../common/FreeVideoQuizAnnouncement'
import { checkIsDateLessThanSep30 } from '../../../TestPage/utils'
import { navigationState } from '../../../src/constants/navigation'
import AddOnTag from '../common/AddOnTag'
import { isVideoQuizAndAIEnabledSelector } from '../../../src/selectors/user'
import { isPearOrEdulasticAssessment } from '../../../../common/utils/helpers'

export const videoQuizPath = '/author/tests/videoquiz'

const QUICK_TOUR_LINK = `//fast.wistia.net/embed/iframe/jd8y6sdt1m`
const descriptionBottom = `
  Provide your video link and proceed to create an ${isPearOrEdulasticAssessment}
`

const OptionVideo = ({ history, isVideoQuizAndAIEnabled }) => {
  const handleCreate = () => {
    segmentApi.genericEventTrack('VideoQuizCreateTestClick', {
      source: 'Test Library',
    })

    if (!isVideoQuizAndAIEnabled) {
      history.push({
        pathname: '/author/subscription',
        state: { view: navigationState.SUBSCRIPTION.view.ADDON },
      })
      return
    }

    history.push({
      pathname: videoQuizPath,
    })
  }
  const isDateLessThanSep30 = checkIsDateLessThanSep30()
  return (
    <CardComponent>
      <EduIf condition={!isVideoQuizAndAIEnabled}>
        <AddonTagPositionTopLeft width="100%" justifyContent="flex-end">
          <AddOnTag message={i18.t('author:aiSuite.addOnText')} />
        </AddonTagPositionTopLeft>
      </EduIf>
      {isDateLessThanSep30 && (
        <ExpiryTextContainer>
          <FreeVideoQuizAnnouncement
            title="Free to use until September 30"
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
const enhance = compose(
  withRouter,
  connect((state) => ({
    isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
  }))
)
export default enhance(OptionVideo)

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
export const AddonTagPositionTopLeft = styled(FlexContainer)`
  width: 100%;
  justify-content: flex-end;
  position: relative;
  bottom: 6rem;
  left: 1.5rem;
`
