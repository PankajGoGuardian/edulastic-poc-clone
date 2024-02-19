import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { isEmpty } from 'lodash'
import {
  EduIf,
  withWindowSizes,
  ImmersiveReader,
  EduThen,
  EduElse,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  testTypes as testTypesConstants,
  questionType,
} from '@edulastic/constants'
import {
  IconEduLogo,
  IconDrc,
  IconCalculator,
  IconScratchPad,
  IconCloudUpload,
  IconEduReferenceSheet,
  IconImmersiveReader,
  IconProfileCircle,
} from '@edulastic/icons'
import { TokenStorage } from '@edulastic/api'
import { Button, Select } from 'antd'
import {
  lightGreySecondary,
  themeColorBlue,
  title as titleColor,
} from '@edulastic/colors'
import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
} from '../../common'

import { StyledHeaderTitle, Container } from './styled'
import { themes } from '../../../../theme'
import {
  setSettingsModalVisibilityAction,
  setZoomLevelAction,
} from '../../../../student/Sidebar/ducks'
import SettingsModal from '../../../../student/sharedComponents/SettingsModal'
import TimedTestTimer from '../../common/TimedTestTimer'
import QuestionSelectDropdown from '../../common/QuestionSelectDropdown'
import { isPearDomain } from '../../../../../utils/pear'
import { AssessPeardeckLogoCompact } from '../../../../admin/Common/StyledComponents'
import { getUserNameSelector } from '../../../../author/src/selectors/user'
import { StyledTextForStudent } from '../../common/styledCompoenents'
import { getUserAccommodations } from '../../../../student/Login/ducks'
import { isImmersiveReaderEnabled } from '../../../utils/helpers'

const {
  playerSkin: { drc },
} = themes
const { header1, header2 } = drc

const CALC = 2
const CROSS_BUTTON = 3
const SCRATCHPAD = 5

const ImmersiveReaderButton = (props) => {
  return (
    <ButtonWrapper {...props}>
      <IconImmersiveReader color={header2.background} />
    </ButtonWrapper>
  )
}

const PlayerHeader = ({
  t: i18Translate,
  title,
  currentItem,
  gotoQuestion,
  headerRef,
  moveToNext,
  options,
  skipped = [],
  bookmarks = [],
  blockNavigationToAnsweredQuestions = false,
  testType,
  timedAssignment,
  utaId,
  groupId,
  zoomLevel,
  settings,
  answerChecksUsedForItem,
  checkAnswerInProgress,
  checkAnswer,
  changeTool,
  qType,
  hasDrawingResponse,
  toggleUserWorkUploadModal,
  enableMagnifier,
  handleMagnifier,
  tool,
  isPremiumContentWithoutAccess = false,
  canShowPlaybackOptionTTS,
  canShowReferenceMaterial,
  isShowReferenceModal,
  openReferenceModal,
  calcTypes,
  immersiveReaderTitle = '',
  userName,
  accommodations,
}) => {
  const {
    enableScratchpad,
    isTeacherPremium,
    showMagnifier,
    maxAnswerChecks,
    showImmersiveReader,
  } = settings

  const { PRACTICE } = testTypesConstants.TEST_TYPES
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE

  const hideCheckAnswer = !TokenStorage.getAccessToken()

  const handleCheckAnswer = () => {
    if (
      isPremiumContentWithoutAccess ||
      checkAnswerInProgress ||
      typeof checkAnswer !== 'function'
    ) {
      return null
    }
    checkAnswer()
  }

  return (
    <FlexContainer>
      {PRACTICE.includes(testType) && (
        <SettingsModal
          isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
          canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
        />
      )}
      <Header
        ref={headerRef}
        style={{
          background: header1.background,
          flexDirection: 'column',
          padding: '0',
          zIndex: 505,
        }}
      >
        <EduIf condition={isPearDomain}>
          <EduThen>
            <IconPearAssessLogoStyled />
          </EduThen>
          <EduElse>
            <IconEduLogoStyled circleFill={header1.background} />
          </EduElse>
        </EduIf>
        <StyledHeaderTitle>
          <div style={{ display: 'flex' }}>
            <Title data-cy="title" title={title}>
              {title}
            </Title>
          </div>
          <FlexContainer alignItems="center">
            <IconProfileCircle isBgDark />
            <StyledTextForStudent color="white">
              {userName}
            </StyledTextForStudent>
          </FlexContainer>
        </StyledHeaderTitle>
        <HeaderMainMenu style={{ background: header2.background }}>
          <NavigationHeader>
            <HeaderWrapper justifyContent="space-between">
              <Container>
                <QuestionSelectDropdown
                  key={currentItem}
                  currentItem={currentItem}
                  gotoQuestion={gotoQuestion}
                  options={options}
                  bookmarks={bookmarks}
                  skipped={skipped}
                  dropdownStyle={{ marginRight: '15px', height: '32px' }}
                  zoomLevel={zoomLevel}
                  moveToNext={moveToNext}
                  utaId={utaId}
                  blockNavigationToAnsweredQuestions={
                    blockNavigationToAnsweredQuestions
                  }
                />
                {canShowReferenceMaterial && (
                  <ButtonWrapper
                    active={isShowReferenceModal}
                    onClick={openReferenceModal}
                    title={i18Translate('header:toolbar.refMaterial')}
                    disabled={isPremiumContentWithoutAccess}
                    aria-label={i18Translate('header:toolbar.refMaterial')}
                  >
                    <IconEduReferenceSheet color={header2.background} />
                  </ButtonWrapper>
                )}
                {maxAnswerChecks > 0 && !hideCheckAnswer && (
                  <ButtonWrapper
                    hoverEffect
                    onClick={handleCheckAnswer}
                    title={
                      checkAnswerInProgress
                        ? i18Translate(
                            'student:common.test.checkAnswerInfoTexts.inProgress'
                          )
                        : answerChecksUsedForItem >= maxAnswerChecks
                        ? i18Translate(
                            'student:common.test.checkAnswerInfoTexts.usageLimitExceeded'
                          )
                        : i18Translate('student:common.test.checkanswer')
                    }
                    data-cy="checkAnswer"
                    aria-label={i18Translate('student:common.test.checkanswer')}
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <IconDrc.Cursor color={header2.background} />
                  </ButtonWrapper>
                )}
                <ButtonWrapper
                  active={tool?.includes(CROSS_BUTTON)}
                  onClick={() =>
                    isDisableCrossBtn ? null : changeTool(CROSS_BUTTON)
                  }
                  disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
                  title={
                    isDisableCrossBtn
                      ? i18Translate('header:toolbar.crossDisabled')
                      : i18Translate('header:toolbar.cross')
                  }
                  data-cy="crossButton"
                  aria-label={i18Translate('header:toolbar.cross')}
                >
                  <IconDrc.AnswerEliminator color={header2.background} />
                </ButtonWrapper>
                <EduIf condition={!isEmpty(calcTypes)}>
                  <ButtonWrapper
                    active={tool?.includes(CALC)}
                    onClick={() => changeTool(CALC)}
                    title={i18Translate('header:toolbar.calculator')}
                    disabled={isPremiumContentWithoutAccess}
                    aria-label={i18Translate('header:toolbar.calculator')}
                  >
                    <IconCalculator color={header2.background} />
                  </ButtonWrapper>
                </EduIf>
                <EduIf condition={enableScratchpad && !hasDrawingResponse}>
                  <ButtonWrapper
                    active={tool?.includes(SCRATCHPAD)}
                    onClick={() => changeTool(SCRATCHPAD)}
                    title={i18Translate('header:toolbar.scratchPad')}
                    data-cy="scratchPad"
                    aria-label={i18Translate('header:toolbar.scratchPad')}
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <IconScratchPad color={header2.background} />
                  </ButtonWrapper>
                </EduIf>
                <EduIf condition={showMagnifier}>
                  <ButtonWrapper
                    active={enableMagnifier}
                    onClick={handleMagnifier}
                    title={i18Translate('header:toolbar.magnify')}
                    data-cy="magnify"
                    aria-label={i18Translate('header:toolbar.magnify')}
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <IconDrc.Zoom color={header2.background} />
                  </ButtonWrapper>
                </EduIf>
                <EduIf condition={isTeacherPremium}>
                  <ButtonWrapper
                    onClick={toggleUserWorkUploadModal}
                    title={i18Translate('header:toolbar.uploadWork')}
                    data-cy="uploadWork"
                    disabled={isPremiumContentWithoutAccess}
                    aria-label={i18Translate('header:toolbar.uploadWork')}
                  >
                    <IconCloudUpload color={header2.background} />
                  </ButtonWrapper>
                </EduIf>
              </Container>
              <RightContent>
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
                <EduIf condition={timedAssignment}>
                  <TimedTestTimer
                    utaId={utaId}
                    groupId={groupId}
                    style={{
                      marginRight: '0px',
                      padding: '0',
                      minHeight: 'auto',
                      fontSize: '12px',
                    }}
                  />
                </EduIf>
              </RightContent>
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
  withNamespaces(['student', 'header']),
  connect(
    (state) => ({
      settings: state.test.settings,
      timedAssignment: state.test?.settings?.timedAssignment,
      testType: state.test?.settings?.testType,
      grades: state.test?.grades,
      subjects: state.test?.subjects,
      zoomLevel: state.ui.zoomLevel,
      userName: getUserNameSelector(state),
      accommodations: getUserAccommodations(state),
    }),
    {
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
      setZoomLevel: setZoomLevelAction,
    }
  )
)

export default enhance(PlayerHeader)

const NavigationHeader = styled(FlexContainer)`
  padding: 7px 50px;
  justify-content: space-between;
  .question-select-dropdown .ant-select {
    height: 32px;
  }
  .question-select-dropdown .anticon-down svg {
    fill: ${header2.background};
  }
  .ant-select-selection .ant-select-selection__rendered i {
    margin-top: 8px;
    margin-right: 5px;
    font-size: 14px;
  }
  .ant-select-selection .ant-select-selection__rendered svg {
    width: 10px;
    min-width: 10px;
    margin-right: 5px;
  }
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
`
const CommonTagStyle = css`
  text-transform: capitalize;
  font-size: 14px;
  border-radius: 2px;
  color: ${header2.textColor};
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

const IconEduLogoStyled = styled(IconEduLogo)`
  position: absolute;
  width: 30px;
  top: -5px;
  left: 8px;
`

const IconPearAssessLogoStyled = styled(AssessPeardeckLogoCompact)`
  position: absolute;
  height: 24px;
  top: 7px;
  left: 5px;
`

const ButtonWrapper = styled(Button)`
  width: 32px;
  height: 32px;
  background: ${header2.textColor};
  margin-left: 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    props.active &&
    `
    background: ${header2.background};
    color: ${header2.textColor};
    border: 1px solid ${header2.textColor};
    svg{
      fill: ${header2.textColor};
      color: ${header2.textColor};
    }
  `}
  ${(props) =>
    !props.disabled
      ? `
  :hover {
    background: ${header2.background};
    color: ${header2.textColor};
    border: 1px solid ${header2.textColor};
    svg{
      fill: ${header2.textColor};
      color: ${header2.textColor};
    }
  }`
      : `
    opacity: 0.5; 
    cursor: default;
  `}
`

export const StyledSelect = styled(Select)`
  margin-left: 20px;
  width: 100px;
  font-size: ${(props) => props.theme.smallFontSize};
  .ant-select-selection {
    height: 32px;
    border: 1px solid ${(props) => props.theme.header.settingsInputBorder};
    background: ${lightGreySecondary};
    color: ${titleColor};
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
  }
  .ant-select-selection__rendered {
    margin: 2px 15px;
  }
`
