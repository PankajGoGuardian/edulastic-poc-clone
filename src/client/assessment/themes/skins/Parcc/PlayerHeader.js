/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { withWindowSizes } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import { IconBookmark } from '@edulastic/icons'
import {
  test as testConstants,
  keyboard as keyboardConst,
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
import ToolBar from './ToolBar'
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

const {
  playerSkin: { parcc },
} = themes
const { header } = parcc

const PlayerHeader = ({
  t,
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
  calcBrands,
  changeCaculateMode,
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
  const isFirst = () => (isDocbased ? true : currentItem === 0)
  const onSettingsChange = (e) => {
    switch (e.key) {
      case 'save':
        return finishTest()
      case 'enableMagnifier':
        return handleMagnifier()
      case 'testOptions':
        return setSettingsModalVisibility(true)
      default:
        break
    }
  }

  const breadcrumbData = [
    { title: 'Assignments', to: '/home/assignments' },
    { title },
  ]

  const { showMagnifier } = settings

  return (
    <FlexContainer>
      {testType === testConstants.type.PRACTICE && <SettingsModal />}
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
                <LogoCompact isMobile={isMobile} fillColor={header.logoColor} />
                <MainActionWrapper>
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
                      disabled={isFirst() || blockNavigationToAnsweredQuestions}
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
                    title="Next"
                    overlayStyle={overlayStyle}
                  >
                    <ControlBtn
                      data-cy="next"
                      icon="right"
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
                      style={{ marginLeft: '5px' }}
                    />
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
                        >
                          <StyledIconBookmark />
                          <span>{t('common.test.bookmark')}</span>
                        </StyledButton>
                      )}
                    </Container>
                  )}
                </MainActionWrapper>
                <ToolBar
                  changeTool={changeTool || toggleToolsOpenStatus}
                  settings={settings}
                  tool={tool || toolsOpenStatus}
                  calcBrands={calcBrands}
                  changeCaculateMode={changeCaculateMode}
                  qType={qType}
                  utaId={utaId}
                  isDocbased={isDocbased}
                  toggleUserWorkUploadModal={toggleUserWorkUploadModal}
                  timedAssignment={timedAssignment}
                  groupId={groupId}
                />
              </FlexContainer>
              <FlexContainer>
                <SettingMenu
                  onSettingsChange={onSettingsChange}
                  utaId={utaId}
                  showMagnifier={isDocbased ? false : showMagnifier}
                  enableMagnifier={enableMagnifier}
                  hidePause={hidePause}
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
    }),
    {
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
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
