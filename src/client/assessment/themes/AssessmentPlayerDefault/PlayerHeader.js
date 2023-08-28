import { IconSend } from '@edulastic/icons'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import qs from 'qs'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { keyboard as keyboardConst } from '@edulastic/constants'
import { Tooltip } from '../../../common/utils/helpers'
import {
  ControlBtn,
  CustomAffix,
  FlexContainer,
  Header,
  HeaderWrapper,
  LogoCompact,
  MainActionWrapper,
  SaveAndExit,
  TestButton,
  ToolBar,
  ToolButton,
  ToolTipContainer,
} from '../common'
import HeaderMainMenu from '../common/HeaderMainMenu'
import QuestionSelectDropdown from '../common/QuestionSelectDropdown'

const PlayerHeader = ({
  LCBPreviewModal,
  headerHeight,
  isMobile,
  currentItem,
  gotoQuestion,
  options,
  bookmarks,
  skipped,
  dropdownStyle,
  zoomLevel,
  overlayStyle,
  disabled,
  isLast,
  moveToPrev,
  moveToNext,
  showSettingIcon,
  answerChecksUsedForItem,
  settings,
  items,
  isNonAutoGradable,
  checkAnswer,
  toggleBookmark,
  isBookmarked,
  handletoggleHints,
  onClickSetting,
  tool: currentToolMode,
  changeTool,
  qType,
  previewPlayer,
  headerStyleWidthZoom,
  finishTest,
  handleMagnifier,
  enableMagnifier,
  toggleUserWorkUploadModal,
  timedAssignment,
  hasDrawingResponse,
  utaId,
  groupId,
  location,
  hidePause,
  blockNavigationToAnsweredQuestions = false,
  isPremiumContentWithoutAccess = false,
  openReferenceModal,
  isShowReferenceModal,
  canShowReferenceMaterial,
}) => {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const { cliUser } = query
  const hideSubmitBtn = cliUser && previewPlayer && isLast

  const rightButtons = (
    <SaveAndExit
      currentItem={currentItem}
      options={options}
      timedAssignment={timedAssignment}
      utaId={utaId}
      hidePause={hidePause}
      groupId={groupId}
      previewPlayer={previewPlayer}
      showZoomBtn
      finishTest={finishTest}
      isCliUserPreview={cliUser}
      LCBPreviewModal={LCBPreviewModal}
      zoomLevel={zoomLevel}
      isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
    />
  )

  return (
    <CustomAffix>
      <Header LCBPreviewModal={LCBPreviewModal}>
        <HeaderMainMenu skin style={{ height: headerHeight }}>
          <FlexContainer style={headerStyleWidthZoom}>
            <HeaderWrapper justifyContent="space-between">
              <MainActionWrapper style={{ alignItems: 'center' }}>
                <LogoCompact isMobile={isMobile} buttons={rightButtons} />
                {!LCBPreviewModal && (
                  <>
                    <QuestionSelectDropdown
                      key={currentItem}
                      currentItem={currentItem}
                      gotoQuestion={gotoQuestion}
                      options={options}
                      bookmarks={bookmarks}
                      skipped={skipped}
                      dropdownStyle={dropdownStyle}
                      zoomLevel={zoomLevel}
                      moveToNext={moveToNext}
                      utaId={utaId}
                      blockNavigationToAnsweredQuestions={
                        blockNavigationToAnsweredQuestions
                      }
                    />
                    <Tooltip
                      placement="top"
                      title={
                        blockNavigationToAnsweredQuestions
                          ? 'This assignment is restricted from navigating back to the previous question.'
                          : 'Previous'
                      }
                      overlayStyle={overlayStyle}
                    >
                      <ControlBtn.Back
                        prev
                        skin
                        data-cy="prev"
                        type="primary"
                        icon="left"
                        aria-label="Previous"
                        disabled={disabled}
                        onClick={(e) => {
                          moveToPrev(null, true)
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
                            moveToPrev(null, true)
                        }}
                      />
                    </Tooltip>
                    {!hideSubmitBtn && (
                      <ControlBtn.Next
                        next
                        skin
                        type="primary"
                        data-cy="next"
                        icon={isLast ? null : 'right'}
                        aria-label={isLast ? 'SUBMIT' : 'NEXT'}
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
                      >
                        {isLast && <IconSend />}
                        {isLast ? 'SUBMIT' : 'NEXT'}
                      </ControlBtn.Next>
                    )}
                  </>
                )}
                <EduIf condition={!showSettingIcon}>
                  <TestButton
                    answerChecksUsedForItem={answerChecksUsedForItem}
                    settings={settings}
                    items={items}
                    currentItem={currentItem}
                    isNonAutoGradable={isNonAutoGradable}
                    checkAnswer={checkAnswer}
                    toggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    handletoggleHints={handletoggleHints}
                    blockNavigationToAnsweredQuestions={
                      blockNavigationToAnsweredQuestions
                    }
                    LCBPreviewModal={LCBPreviewModal}
                    isPremiumContentWithoutAccess={
                      isPremiumContentWithoutAccess
                    }
                  />
                </EduIf>
                <EduIf condition={!LCBPreviewModal}>
                  <ToolTipContainer>
                    <EduIf condition={showSettingIcon}>
                      <EduThen>
                        <Tooltip
                          placement="top"
                          title="Tool"
                          overlayStyle={overlayStyle}
                        >
                          <ToolButton
                            next
                            skin
                            type="primary"
                            icon="tool"
                            data-cy="setting"
                            onClick={onClickSetting}
                          />
                        </Tooltip>
                      </EduThen>
                      <EduElse>
                        <ToolBar
                          settings={settings}
                          tool={currentToolMode}
                          changeTool={changeTool}
                          qType={qType}
                          handleMagnifier={handleMagnifier}
                          enableMagnifier={enableMagnifier}
                          toggleUserWorkUploadModal={toggleUserWorkUploadModal}
                          timedAssignment={timedAssignment}
                          utaId={utaId}
                          hasDrawingResponse={hasDrawingResponse}
                          groupId={groupId}
                          openReferenceModal={openReferenceModal}
                          isShowReferenceModal={isShowReferenceModal}
                          canShowReferenceMaterial={canShowReferenceMaterial}
                          isPremiumContentWithoutAccess={
                            isPremiumContentWithoutAccess
                          }
                        />
                      </EduElse>
                    </EduIf>
                  </ToolTipContainer>
                </EduIf>
              </MainActionWrapper>
              <EduIf condition={!isMobile}>
                <>{rightButtons}</>
              </EduIf>
            </HeaderWrapper>
          </FlexContainer>
        </HeaderMainMenu>
      </Header>
    </CustomAffix>
  )
}

const enhance = compose(withRouter)

export default enhance(PlayerHeader)
