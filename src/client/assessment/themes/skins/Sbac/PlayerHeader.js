/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { withWindowSizes, ImmersiveReader, EduIf } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import {
  keyboard as keyboardConst,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { round } from 'lodash'
import {
  IconBookmark,
  IconSend,
  IconImmersiveReader,
  IconProfileCircle,
} from '@edulastic/icons'
import { Tooltip } from '../../../../common/utils/helpers'
import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
  LogoCompact,
  MainActionWrapper,
} from '../../common'
import { useUtaPauseAllowed } from '../../common/SaveAndExit'
import { MAX_MOBILE_WIDTH } from '../../../constants/others'
import {
  ControlBtn,
  HeaderTopMenu,
  StyledFlexContainer,
  StyledProgress,
  StyledTitle,
  StyledQuestionMark,
  StyledButton,
  StyledIcon,
} from './styled'
import { themes } from '../../../../theme'
import {
  getUserNameSelector,
  getUserRole,
} from '../../../../author/src/selectors/user'
import QuestionList from './QuestionList'
import ToolBar from './ToolBar'
import { setZoomLevelAction } from '../../../../student/Sidebar/ducks'
import SettingsModal from '../../../../student/sharedComponents/SettingsModal'
import { getIsPreviewModalVisibleSelector } from '../../../selectors/test'
import { getCurrentLanguage } from '../../../../common/components/LanguageSelectorTab/duck'
import { StyledTextForStudent } from '../../common/styledCompoenents'
import { isImmersiveReaderEnabled } from '../../../utils/helpers'
import { getAccommodationsTtsSelector } from '../../../../student/Login/ducks'

const {
  playerSkin: { sbac },
} = themes
const { header } = sbac

const ImmersiveReaderButton = (props) => {
  return (
    <StyledButton {...props} padding="8px 4px 7px 5px">
      <IconImmersiveReader height={20} width={20} />
    </StyledButton>
  )
}

const PlayerHeader = ({
  title,
  currentItem,
  gotoQuestion,
  settings,
  headerRef,
  isMobile,
  moveToPrev,
  moveToNext,
  overlayStyle,
  options,
  skipped = [],
  changeTool,
  toggleToolsOpenStatus,
  tool,
  finishTest,
  items,
  qType,
  setZoomLevel,
  zoomLevel,
  isDocbased,
  toolsOpenStatus,
  handleMagnifier,
  enableMagnifier,
  toggleUserWorkUploadModal,
  timedAssignment,
  utaId,
  groupId,
  hidePause,
  blockNavigationToAnsweredQuestions,
  testType,
  isPremiumContentWithoutAccess = false,
  checkAnswer,
  answerChecksUsedForItem,
  canShowPlaybackOptionTTS,
  toggleBookmark,
  isBookmarked,
  bookmarks = [],
  defaultAP,
  canShowReferenceMaterial,
  isShowReferenceModal,
  openReferenceModal,
  t: i18Translate,
  firstItemInSectionAndRestrictNav,
  immersiveReaderTitle = '',
  showSubmitText,
  userName,
  accommodations,
}) => {
  useEffect(() => {
    return () => setZoomLevel(1)
  }, [])

  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed
  const { PRACTICE } = testTypesConstants.TEST_TYPES

  const totalQuestions = options.length
  const totalAnswered = skipped.filter((s) => !s).length
  const isFirst = () => (isDocbased ? true : currentItem === 0)

  const headerStyle = {
    borderBottom: `1px solid ${header.borderColor}`,
    background: header.background,
    flexDirection: 'column',
    padding: '0',
    zIndex: 505,
  }

  const { showMagnifier, showImmersiveReader } = settings

  return (
    <StyledFlexContainer>
      {PRACTICE.includes(testType) && (
        <SettingsModal
          isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
          canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
        />
      )}
      <Header ref={headerRef} style={headerStyle}>
        <HeaderTopMenu
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 600,
          }}
        >
          <FlexContainer className="sabc-header-question-list">
            {!isDocbased && (
              <>
                <QuestionList
                  options={options}
                  currentItem={currentItem}
                  gotoQuestion={gotoQuestion}
                  blockNavigationToAnsweredQuestions={
                    blockNavigationToAnsweredQuestions
                  }
                  bookmarks={bookmarks}
                  skipped={skipped}
                  i18Translate={i18Translate}
                  dropdownStyle={{ marginRight: '15px', height: '32px' }}
                  moveToNext={moveToNext}
                  utaId={utaId}
                  zoomLevel={zoomLevel}
                />
                <div style={{ width: 136, display: 'flex' }}>
                  <StyledProgress
                    percent={round((totalAnswered / totalQuestions) * 100)}
                    size="small"
                    strokeColor="#1B5392"
                  />
                </div>
              </>
            )}
            <StyledTitle>{title}</StyledTitle>
          </FlexContainer>
          <FlexContainer>
            <FlexContainer alignItems="center">
              <IconProfileCircle />
              <Tooltip title={userName}>
                <StyledTextForStudent $timedAssignment={timedAssignment}>
                  {userName}
                </StyledTextForStudent>
              </Tooltip>
            </FlexContainer>
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
            <StyledQuestionMark type="question-circle" theme="filled" />
          </FlexContainer>
        </HeaderTopMenu>
        <HeaderMainMenu style={{ padding: '0 20px' }}>
          <HeaderSbacPlayer>
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
                    title={
                      showSubmitText
                        ? i18Translate(
                            'student:common.layout.questionNavigation.submit'
                          )
                        : i18Translate(
                            'student:common.layout.questionNavigation.next'
                          )
                    }
                    overlayStyle={overlayStyle}
                  >
                    <ControlBtn
                      data-cy="next"
                      aria-label={
                        showSubmitText
                          ? i18Translate(
                              'student:common.layout.questionNavigation.submit'
                            )
                          : i18Translate(
                              'student:common.layout.questionNavigation.next'
                            )
                      }
                      icon={showSubmitText ? null : 'right'}
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
                </MainActionWrapper>
                <FlexContainer style={{ marginLeft: '28px' }}>
                  {!blockNavigationToAnsweredQuestions && (
                    <Tooltip
                      placement="top"
                      title={i18Translate('header:toolbar.bookmark')}
                    >
                      <StyledButton
                        data-cy="bookmark"
                        aria-label="Bookmark"
                        onClick={
                          defaultAP
                            ? toggleBookmark
                            : () => toggleBookmark(items[currentItem]?._id)
                        }
                        active={isBookmarked}
                        disabled={isPremiumContentWithoutAccess}
                      >
                        <StyledIconBookmark />
                      </StyledButton>
                    </Tooltip>
                  )}

                  {showPause && (
                    <Tooltip
                      placement="top"
                      title={
                        hidePause
                          ? i18Translate(
                              'header:saveAndExit.assignmentInOneSitting'
                            )
                          : i18Translate('header:saveAndExit.saveAndExit')
                      }
                    >
                      <StyledButton
                        data-cy="finishTest"
                        aria-label="Save & Exit"
                        disabled={hidePause}
                        onClick={finishTest}
                      >
                        <StyledIcon type="save" theme="filled" />
                      </StyledButton>
                    </Tooltip>
                  )}
                </FlexContainer>
              </FlexContainer>
              <ToolBar
                changeTool={changeTool || toggleToolsOpenStatus}
                settings={settings}
                tool={tool || toolsOpenStatus}
                qType={qType}
                setZoomLevel={setZoomLevel}
                zoomLevel={zoomLevel}
                isDocbased={isDocbased}
                handleMagnifier={handleMagnifier}
                showMagnifier={isDocbased ? false : showMagnifier}
                enableMagnifier={enableMagnifier}
                toggleUserWorkUploadModal={toggleUserWorkUploadModal}
                timedAssignment={timedAssignment}
                utaId={utaId}
                groupId={groupId}
                header={header}
                isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
                checkAnswer={checkAnswer}
                answerChecksUsedForItem={answerChecksUsedForItem}
                canShowReferenceMaterial={canShowReferenceMaterial}
                isShowReferenceModal={isShowReferenceModal}
                openReferenceModal={openReferenceModal}
                i18Translate={i18Translate}
              />
            </HeaderWrapper>
          </HeaderSbacPlayer>
        </HeaderMainMenu>
      </Header>
    </StyledFlexContainer>
  )
}

PlayerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  currentItem: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  headerRef: PropTypes.node.isRequired,
  isMobile: PropTypes.bool.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  overlayStyle: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  skipped: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  tool: PropTypes.array.isRequired,
  finishTest: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  qType: PropTypes.string.isRequired,
  setZoomLevel: PropTypes.func.isRequired,
  zoomLevel: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('student'),
  connect(
    (state) => ({
      settings: state.test.settings,
      showUserTTS: getAccommodationsTtsSelector(state),
      userRole: getUserRole(state),
      timedAssignment: state.test?.settings?.timedAssignment,
      testType: state.test?.settings?.testType,
      isTestPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      utaPreferredLanguage: getCurrentLanguage(state),
      userName: getUserNameSelector(state),
    }),
    {
      setZoomLevel: setZoomLevelAction,
    }
  )
)

export default enhance(PlayerHeader)

const HeaderSbacPlayer = styled(FlexContainer)`
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
