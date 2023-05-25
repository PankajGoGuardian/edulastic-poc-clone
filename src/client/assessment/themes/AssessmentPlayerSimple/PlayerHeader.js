/* eslint-disable react/prop-types */
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import styled from 'styled-components'
import { nonAutoGradableTypes } from '@edulastic/constants'
import { EduIf, withWindowSizes } from '@edulastic/common'
import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import { Tooltip, isZoomGreator } from '../../../common/utils/helpers'

import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
  TestButton,
  ToolButton,
  SaveAndExit,
  LogoCompact,
  ToolBar,
  ToolTipContainer,
  MainActionWrapper,
} from '../common'

import { MAX_MOBILE_WIDTH, IPAD_LANDSCAPE_WIDTH } from '../../constants/others'

import SettingsModal from '../../../student/sharedComponents/SettingsModal'
import QuestionSelectDropdown from '../common/QuestionSelectDropdown'

import ToolbarModal from '../common/ToolbarModal'

const PlayerHeader = ({
  title,
  dropdownOptions,
  currentItem,
  onOpenExitPopup,
  theme,
  gotoQuestion,
  settings,
  windowWidth,
  items,
  answerChecksUsedForItem,
  checkAnswer,
  toggleBookmark,
  isBookmarked,
  onshowHideHints,
  toggleToolsOpenStatus,
  toolsOpenStatus,
  headerRef,
  previewPlayer,
  handleMagnifier,
  enableMagnifier,
  toggleUserWorkUploadModal,
  timedAssignment,
  utaId,
  groupId,
  hidePause,
  blockNavigationToAnsweredQuestions,
  LCBPreviewModal = false,
  isPremiumContentWithoutAccess = false,
  canShowPlaybackOptionTTS,
  canShowReferenceMaterial,
  isShowReferenceModal,
  openReferenceModal,
  showCalculator,
}) => {
  const [isToolbarModalVisible, setToolbarModalVisible] = useState(false)

  const showSettingIcon =
    windowWidth < IPAD_LANDSCAPE_WIDTH || isZoomGreator('md', theme.zoomLevel)
  let isNonAutoGradable = false
  const item = items[currentItem]
  if (item.data && item.data.questions) {
    item.data.questions.forEach((question) => {
      if (nonAutoGradableTypes.includes(question.type)) {
        isNonAutoGradable = true
      }
    })
  }

  const isMobile = windowWidth <= MAX_MOBILE_WIDTH
  const rightButtons = (
    <SaveAndExit
      utaId={utaId}
      groupId={groupId}
      previewPlayer={previewPlayer}
      showZoomBtn
      hidePause={hidePause}
      finishTest={onOpenExitPopup}
      timedAssignment={timedAssignment}
      currentItem={currentItem}
      options={dropdownOptions}
      isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
    />
  )

  return (
    <>
      <ToolbarModal
        isVisible={isToolbarModalVisible}
        onClose={() => setToolbarModalVisible(false)}
        checkAnswer={checkAnswer}
        windowWidth={windowWidth}
        answerChecksUsedForItem={answerChecksUsedForItem}
        settings={settings}
        items={items}
        currentItem={currentItem}
        isNonAutoGradable={isNonAutoGradable}
        toggleBookmark={() => toggleBookmark(item._id)}
        isBookmarked={isBookmarked}
        handletoggleHints={onshowHideHints}
        changeTool={toggleToolsOpenStatus}
        blockNavigationToAnsweredQuestions={blockNavigationToAnsweredQuestions}
        isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
        toggleUserWorkUploadModal={toggleUserWorkUploadModal}
        openReferenceModal={openReferenceModal}
        isShowReferenceModal={isShowReferenceModal}
        canShowReferenceMaterial={canShowReferenceMaterial}
      />
      <SettingsModal
        isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
        canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
      />
      <Header ref={headerRef}>
        <HeaderMainMenu skinb="true">
          <HeaderPracticePlayer>
            <HeaderWrapper justifyContent="space-between">
              <LogoCompact
                isMobile={isMobile}
                buttons={rightButtons}
                title={title}
              />
              <MainActionWrapper alignItems="center">
                {isMobile && (
                  <QuestionSelectDropdown
                    key={currentItem}
                    currentItem={currentItem}
                    gotoQuestion={gotoQuestion}
                    options={dropdownOptions}
                    skinb="true"
                    blockNavigationToAnsweredQuestions={
                      blockNavigationToAnsweredQuestions
                    }
                  />
                )}
                {showSettingIcon && (
                  <ToolTipContainer>
                    <Tooltip placement="top" title="Tool">
                      <ToolButton
                        next
                        skin
                        size="large"
                        type="primary"
                        icon="tool"
                        data-cy="setting"
                        onClick={() => setToolbarModalVisible(true)}
                      />
                    </Tooltip>
                  </ToolTipContainer>
                )}
                <EduIf condition={!showSettingIcon}>
                  <TestButton
                    answerChecksUsedForItem={answerChecksUsedForItem}
                    settings={settings}
                    items={items}
                    currentItem={currentItem}
                    isNonAutoGradable={isNonAutoGradable}
                    checkAnswer={checkAnswer}
                    toggleBookmark={() => toggleBookmark(item._id)}
                    isBookmarked={isBookmarked}
                    handletoggleHints={onshowHideHints}
                    blockNavigationToAnsweredQuestions={
                      blockNavigationToAnsweredQuestions
                    }
                    LCBPreviewModal={LCBPreviewModal}
                    isPremiumContentWithoutAccess={
                      isPremiumContentWithoutAccess
                    }
                  />{' '}
                  <ToolBar
                    settings={settings}
                    tool={toolsOpenStatus}
                    changeTool={toggleToolsOpenStatus}
                    qType={get(
                      items,
                      `[${currentItem}].data.questions[0].type`,
                      null
                    )}
                    handleMagnifier={handleMagnifier}
                    enableMagnifier={enableMagnifier}
                    toggleUserWorkUploadModal={toggleUserWorkUploadModal}
                    timedAssignment={timedAssignment}
                    utaId={utaId}
                    groupId={groupId}
                    isPremiumContentWithoutAccess={
                      isPremiumContentWithoutAccess
                    }
                    openReferenceModal={openReferenceModal}
                    isShowReferenceModal={isShowReferenceModal}
                    canShowReferenceMaterial={canShowReferenceMaterial}
                    showCalculator={showCalculator}
                  />
                </EduIf>
              </MainActionWrapper>
              <EduIf condition={!isMobile}>
                <>{rightButtons}</>
              </EduIf>
            </HeaderWrapper>
          </HeaderPracticePlayer>
        </HeaderMainMenu>
      </Header>
    </>
  )
}

PlayerHeader.defaultProps = {
  onSaveProgress: () => {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state, { timedAssignment }) => ({
      settings: state.test.settings,
      timedAssignment: timedAssignment || state.test?.settings?.timedAssignment,
    }),
    null
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
    padding: 8.5px 0px;
  }
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    padding: 0px;
  }
`
