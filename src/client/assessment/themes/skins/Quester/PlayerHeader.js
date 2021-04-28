import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { withWindowSizes } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { test as testConstants } from '@edulastic/constants'
import {
  IconEduLogo,
  IconSignoutHighlight,
  IconQuester,
} from '@edulastic/icons'
import { Tooltip } from '../../../../common/utils/helpers'
import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
} from '../../common'

import ReviewQuestionsModal from './ReviewQuestionsModal'
import {
  StyledButton,
  ControlBtn,
  StyledHeaderTitle,
  Container,
} from './styled'
import { themes } from '../../../../theme'
import { setSettingsModalVisibilityAction } from '../../../../student/Sidebar/ducks'
import SettingsModal from '../../../../student/sharedComponents/SettingsModal'
import TimedTestTimer from '../../common/TimedTestTimer'
import { useUtaPauseAllowed } from '../../common/SaveAndExit'

const {
  playerSkin: { quester },
} = themes
const { header1, header2 } = quester

const PlayerHeader = ({
  t,
  title,
  currentItem,
  gotoQuestion,
  headerRef,
  moveToPrev,
  moveToNext,
  overlayStyle,
  options,
  skipped = [],
  bookmarks = [],
  finishTest,
  isDocbased,
  blockNavigationToAnsweredQuestions = false,
  testType,
  gotoSummary,
  previewPlayer,
  timedAssignment,
  utaId,
  groupId,
  hidePause,
  items,
  grades,
  subjects,
}) => {
  const totalQuestions = options.length
  const totalBookmarks = bookmarks.filter((b) => b).length
  const totalUnanswered = skipped.filter((s) => s).length
  const filterData = {
    totalQuestions:
      totalQuestions > 0 ? `0${totalQuestions}`.slice(-2) : totalQuestions,
    totalBookmarks:
      totalBookmarks > 0 ? `0${totalBookmarks}`.slice(-2) : totalBookmarks,
    totalUnanswered:
      totalUnanswered > 0 ? `0${totalUnanswered}`.slice(-2) : totalUnanswered,
  }
  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed

  const [showReviewPopup, setShowReviewPopup] = useState(false)

  const isFirst = () => (isDocbased ? true : currentItem === 0)
  const isLast = () => currentItem === items.length - 1

  const handleOpen = () => {
    setShowReviewPopup(true)
  }

  const handleClose = () => {
    setShowReviewPopup(false)
  }

  return (
    <FlexContainer>
      {testType === testConstants.type.PRACTICE && <SettingsModal />}
      <ReviewQuestionsModal
        options={options}
        filterData={filterData}
        currentItem={currentItem}
        key={currentItem}
        gotoQuestion={gotoQuestion}
        skipped={skipped}
        bookmarks={bookmarks}
        blockNavigationToAnsweredQuestions={blockNavigationToAnsweredQuestions}
        handleClose={handleClose}
        showReviewPopup={showReviewPopup}
        gotoSummary={gotoSummary}
        previewPlayer={previewPlayer}
        finishTest={finishTest}
      />
      <Header
        ref={headerRef}
        style={{
          background: header1.background,
          flexDirection: 'column',
          padding: '0',
          zIndex: 505,
        }}
      >
        <IconEduLogoStyled circleFill={header1.background} />
        <StyledHeaderTitle>
          <div style={{ display: 'flex' }}>
            {!!grades.length && (
              <Grades data-cy="grades">GRADE {grades.join(',')}</Grades>
            )}
            {!!subjects.length && (
              <Subjects data-cy="subjects">{subjects.join(',')}</Subjects>
            )}
            <Title data-cy="title" title={title}>
              {title}
            </Title>
          </div>
          <RightContent>
            {timedAssignment && (
              <TimedTestTimer
                utaId={utaId}
                groupId={groupId}
                style={{
                  marginRight: '50px',
                  padding: '0',
                  minHeight: 'auto',
                  fontSize: '12px',
                }}
              />
            )}

            {showPause && (
              <Tooltip
                placement="top"
                title={hidePause ? `Save & Exit disabled` : `Save & Exit`}
              >
                <SignOut
                  data-cy="finishTest"
                  onClick={finishTest}
                  disabled={hidePause}
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (hidePause) return
                    const code = e.which
                    if (code === 13 || code === 32) {
                      finishTest()
                    }
                  }}
                >
                  {!hidePause && (
                    <IconSignoutHighlight style={{ marginRight: '10px' }} />
                  )}
                  SIGN OUT
                </SignOut>
              </Tooltip>
            )}
          </RightContent>
        </StyledHeaderTitle>
        <HeaderMainMenu style={{ background: header2.background }}>
          <NavigationHeader>
            <HeaderWrapper justifyContent="space-between">
              {!isDocbased && (
                <Container
                  className="quester-question-list"
                  onClick={handleOpen}
                >
                  <StyledButton
                    data-cy="options"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (hidePause) return
                      const code = e.which
                      if (code === 13 || code === 32) {
                        handleOpen()
                      }
                    }}
                  >
                    <span>
                      {isLast()
                        ? t('common.test.reviewAndSubmit')
                        : t('common.test.review')}
                    </span>
                  </StyledButton>
                </Container>
              )}
              <Container
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                }}
                data-cy="questionLeft"
              >
                Question {currentItem + 1} of {totalQuestions}
              </Container>
              <Container>
                <Tooltip
                  placement="top"
                  title={
                    blockNavigationToAnsweredQuestions
                      ? 'This assignment is restricted from navigating back to the previous question.'
                      : 'Previous'
                  }
                  overlayStyle={overlayStyle}
                >
                  <ControlBtn
                    data-cy="prev"
                    icon="left"
                    type="primary"
                    disabled={isFirst() || blockNavigationToAnsweredQuestions}
                    onClick={(e) => {
                      moveToPrev()
                      e.target.blur()
                    }}
                  >
                    <IconQuester.IconPrevious />
                  </ControlBtn>
                </Tooltip>
                <Tooltip
                  placement="top"
                  title="Next"
                  overlayStyle={overlayStyle}
                >
                  <ControlBtn
                    data-cy="next"
                    type="primary"
                    icon="right"
                    onClick={(e) => {
                      moveToNext()
                      e.target.blur()
                    }}
                    style={{ marginLeft: '15px' }}
                  >
                    <IconQuester.IconNext style={{ marginRight: '10px' }} />
                    <span>{isLast() ? 'SUBMIT' : 'NEXT'}</span>
                  </ControlBtn>
                </Tooltip>
              </Container>
            </HeaderWrapper>
          </NavigationHeader>
        </HeaderMainMenu>
      </Header>
    </FlexContainer>
  )
}

PlayerHeader.defaultProps = {
  onSaveProgress: () => {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('student'),
  connect(
    (state) => ({
      settings: state.test.settings,
      timedAssignment: state.test?.settings?.timedAssignment,
      testType: state.test?.settings?.testType,
      grades: state.test?.grades,
      subjects: state.test?.subjects,
    }),
    {
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
    }
  )
)

export default enhance(PlayerHeader)

const NavigationHeader = styled(FlexContainer)`
  padding: 7px 50px;
  justify-content: space-between;
`

const SignOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 10px;
  svg {
    color: #fff;
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColor};
  }
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
`
const CommonTagStyle = css`
  background: white;
  padding: 5px 15px;
  text-transform: uppercase;
  font-size: 10px;
  border-radius: 2px;
  color: #6a737f;
  margin-right: 5px;
  font-weight: bold;
`

const Title = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${CommonTagStyle}
`

const Grades = styled.div`
  ${CommonTagStyle}
`
const Subjects = styled.div`
  ${CommonTagStyle}
`

const IconEduLogoStyled = styled(IconEduLogo)`
  position: absolute;
  width: 30px;
  top: -5px;
  left: 8px;
`
