/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { withWindowSizes, ImmersiveReader, EduIf } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import { IconBookmark, IconSend, IconImmersiveReader } from '@edulastic/icons'
import {
  keyboard as keyboardConst,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { Tooltip } from '../../../../common/utils/helpers'
import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
  LogoCompact,
  MainActionWrapper,
} from '../../common'

import { MAX_MOBILE_WIDTH } from '../../../constants/others'

import ReviewToolbar from './ReviewToolbar'
import SettingMenu from './SettingMenu'
import ToolBar, { StyledButton as StyledButtonContainer } from './ToolBar'
import Breadcrumb from '../../../../student/sharedComponents/Breadcrumb'
import {
  StyledButton,
  ControlBtn,
  StyledHeaderTitle,
  Container,
} from './styled'
import { themes } from '../../../../theme'
import { setSettingsModalVisibilityAction } from '../../../../student/Sidebar/ducks'
import SettingsModal from '../../../../student/sharedComponents/SettingsModal'
import ChangeColor from './ChangeColor'
import {
  hideLineReaderAction,
  lineReaderVisible,
  showLineReaderAction,
} from '../../../../common/components/LineReader/duck'
import useLineReader from '../../../../common/components/LineReader/components/useLineReader'
import LineReader from '../../../../common/components/LineReader'
import { getUserAccommodations } from '../../../../student/Login/ducks'
import { isImmersiveReaderEnabled } from '../../../utils/helpers'

const {
  playerSkin: { parcc },
} = themes
const { header } = parcc

const ImmersiveReaderButton = (props) => {
  return (
    <StyledButtonContainer {...props}>
      <IconImmersiveReader />
    </StyledButtonContainer>
  )
}

const PlayerHeader = ({
  t: i18Translate,
  title,
  currentItem,
  gotoQuestion,
  settings,
  toggleBookmark,
  isBookmarked,
  headerRef,
  isMobile,
  moveToPrev,
  moveToNext,
  overlayStyle,
  options,
  skipped = [],
  bookmarks = [],
  changeTool,
  toggleToolsOpenStatus,
  tool,
  finishTest,
  qType,
  defaultAP,
  isDocbased,
  items,
  toolsOpenStatus,
  handleMagnifier,
  enableMagnifier,
  toggleUserWorkUploadModal,
  timedAssignment,
  utaId,
  groupId,
  hidePause,
  blockNavigationToAnsweredQuestions = false,
  setSettingsModalVisibility,
  testType,
  isPremiumContentWithoutAccess = false,
  checkAnswer,
  answerChecksUsedForItem,
  canShowPlaybackOptionTTS,
  firstItemInSectionAndRestrictNav,
  immersiveReaderTitle,
  openReferenceModal,
  isShowReferenceModal,
  canShowReferenceMaterial,
  showLineReader,
  hideLineReader,
  isLineReaderVisible,
  showSubmitText,
  accommodations,
}) => {
  const { PRACTICE } = testTypesConstants.TEST_TYPES
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
  const isFirst = () => (isDocbased ? true : currentItem === 0)
  const [, destoryReader] = useLineReader(hideLineReader)

  const [showChangeColor, setShowChangeColor] = useState(false)
  const onSettingsChange = (e) => {
    switch (e.key) {
      case 'save':
        return finishTest()
      case 'enableMagnifier':
        return handleMagnifier()
      case 'testOptions':
        return setSettingsModalVisibility(true)
      case 'changeColor':
        return setShowChangeColor(true)
      case 'showLineReaderMask':
        return isLineReaderVisible ? destoryReader() : showLineReader()
      default:
        break
    }
  }

  const breadcrumbData = [
    { title: 'Assignments', to: '/home/assignments' },
    { title },
  ]

  const { showMagnifier, showImmersiveReader = false } = settings

  return (
    <FlexContainer>
      {PRACTICE.includes(testType) && (
        <SettingsModal
          isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
          canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
        />
      )}
      {showChangeColor && (
        <ChangeColor
          showChangeColor={showChangeColor}
          closeModal={() => setShowChangeColor(false)}
        />
      )}
      <Header
        ref={headerRef}
        style={{
          background: header.background,
          flexDirection: 'column',
          padding: '0',
          zIndex: 505,
        }}
      >
        <HeaderMainMenu style={{ padding: '0 40px' }}>
          <HeaderPracticePlayer>
            <HeaderWrapper justifyContent="space-between">
              <FlexContainer>
                <LogoCompact
                  isMobile={isMobile}
                  fillColor={header.logoColor}
                  isBgLight
                />
                <MainActionWrapper>
                  <Tooltip
                    placement="top"
                    title={
                      blockNavigationToAnsweredQuestions
                        ? i18Translate(
                            'student:common.layout.questionNavigation.blockNavigationToAnsweredQuestions'
                          )
                        : i18Translate(
                            'student:common.layout.questionNavigation.previous'
                          )
                    }
                    overlayStyle={overlayStyle}
                  >
                    <ControlBtn
                      data-cy="prev"
                      icon="left"
                      disabled={
                        isFirst() ||
                        blockNavigationToAnsweredQuestions ||
                        firstItemInSectionAndRestrictNav
                      }
                      aria-label="Previous"
                      onClick={(e) => {
                        moveToPrev()
                        e.target.blur()
                      }}
                      // added separate keydown event handler to restrict calling on blur event for keyboard event
                      onKeyDown={(e) => {
                        const code = e.which || e.keyCode
                        if (code !== keyboardConst.TAB_KEY) e.preventDefault()
                        if (
                          [
                            keyboardConst.ENTER_KEY,
                            keyboardConst.SPACE_KEY,
                          ].includes(code)
                        )
                          moveToPrev()
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    placement="top"
                    title={`${
                      showSubmitText
                        ? i18Translate(
                            'student:common.layout.questionNavigation.submit'
                          )
                        : i18Translate(
                            'student:common.layout.questionNavigation.next'
                          )
                    }`}
                    overlayStyle={overlayStyle}
                  >
                    <ControlBtn
                      data-cy="next"
                      icon={showSubmitText ? null : 'right'}
                      aria-label={showSubmitText ? 'SUBMIT' : 'NEXT'}
                      onClick={(e) => {
                        moveToNext()
                        e.target.blur()
                      }}
                      // added separate keydown event handler to restrict calling on blur event for keyboard event
                      onKeyDown={(e) => {
                        const code = e.which || e.keyCode
                        if (code !== keyboardConst.TAB_KEY) e.preventDefault()
                        if (
                          [
                            keyboardConst.ENTER_KEY,
                            keyboardConst.SPACE_KEY,
                          ].includes(code)
                        )
                          moveToNext()
                      }}
                      style={{
                        marginLeft: '5px',
                        width: 'auto',
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      {showSubmitText && (
                        <IconSend
                          style={{
                            marginRight: '10px',
                          }}
                        />
                      )}
                      {showSubmitText
                        ? i18Translate(
                            'student:common.layout.questionNavigation.submit'
                          )
                        : i18Translate(
                            'student:common.layout.questionNavigation.next'
                          )}
                    </ControlBtn>
                  </Tooltip>
                  {!isDocbased && (
                    <Container>
                      <ReviewToolbar
                        options={options}
                        filterData={filterData}
                        currentItem={currentItem}
                        key={currentItem}
                        gotoQuestion={gotoQuestion}
                        skipped={skipped}
                        bookmarks={bookmarks}
                        blockNavigationToAnsweredQuestions={
                          blockNavigationToAnsweredQuestions
                        }
                      />
                      {!blockNavigationToAnsweredQuestions && (
                        <StyledButton
                          onClick={
                            defaultAP
                              ? toggleBookmark
                              : () => toggleBookmark(items[currentItem]?._id)
                          }
                          active={isBookmarked}
                          disabled={isPremiumContentWithoutAccess}
                          aria-label={i18Translate('header:toolbar.bookmark')}
                        >
                          <StyledIconBookmark />
                          <span>{i18Translate('header:toolbar.bookmark')}</span>
                        </StyledButton>
                      )}
                    </Container>
                  )}
                </MainActionWrapper>
                <ToolBar
                  changeTool={changeTool || toggleToolsOpenStatus}
                  settings={settings}
                  tool={tool || toolsOpenStatus}
                  qType={qType}
                  utaId={utaId}
                  isDocbased={isDocbased}
                  toggleUserWorkUploadModal={toggleUserWorkUploadModal}
                  timedAssignment={timedAssignment}
                  groupId={groupId}
                  isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
                  answerChecksUsedForItem={answerChecksUsedForItem}
                  checkAnswer={checkAnswer}
                  i18Translate={i18Translate}
                  openReferenceModal={openReferenceModal}
                  canShowReferenceMaterial={canShowReferenceMaterial}
                  isShowReferenceModal={isShowReferenceModal}
                />
              </FlexContainer>
              <FlexContainer>
                <EduIf
                  condition={isImmersiveReaderEnabled(
                    showImmersiveReader,
                    accommodations
                  )}
                >
                  <ImmersiveReader
                    ImmersiveReaderButton={ImmersiveReaderButton}
                    title={immersiveReaderTitle}
                  />
                </EduIf>
                <SettingMenu
                  onSettingsChange={onSettingsChange}
                  utaId={utaId}
                  showMagnifier={isDocbased ? false : showMagnifier}
                  enableMagnifier={enableMagnifier}
                  hidePause={hidePause}
                  isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
                  canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
                  i18Translate={i18Translate}
                />
              </FlexContainer>
            </HeaderWrapper>
          </HeaderPracticePlayer>
        </HeaderMainMenu>
        <StyledHeaderTitle>
          <BreadcrumbContainer>
            <Breadcrumb data={breadcrumbData} />
          </BreadcrumbContainer>
        </StyledHeaderTitle>
      </Header>
      <LineReader hideButton i18Translate={i18Translate} />
    </FlexContainer>
  )
}

PlayerHeader.defaultProps = {
  onSaveProgress: () => {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces(['student', 'header']),
  connect(
    (state) => ({
      settings: state.test.settings,
      timedAssignment: state.test?.settings?.timedAssignment,
      testType: state.test?.settings?.testType,
      isLineReaderVisible: lineReaderVisible(state),
      accommodations: getUserAccommodations(state),
    }),
    {
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
      showLineReader: showLineReaderAction,
      hideLineReader: hideLineReaderAction,
    }
  )
)

export default enhance(PlayerHeader)

const HeaderPracticePlayer = styled(FlexContainer)`
  padding: 12px 0px;
  justify-content: space-between;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 11px 0px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 14px 0px;
  }
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    padding: 0px;
  }
`

const StyledIconBookmark = styled(IconBookmark)`
  ${({ theme }) => `
    width: ${theme.default.headerBookmarkIconWidth};
    height: ${theme.default.headerBookmarkIconHeight};
  `}
`

const BreadcrumbContainer = styled.div`
  flex: 1;
`
