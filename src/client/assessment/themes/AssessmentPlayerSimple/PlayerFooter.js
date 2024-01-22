/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { IconCorrect } from '@edulastic/icons'
import {
  themeColor,
  largeDesktopWidth,
  themeColorBlue,
} from '@edulastic/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FlexContainer } from '../common'

import {
  IPAD_PORTRAIT_WIDTH,
  IPAD_LANDSCAPE_WIDTH,
  LARGE_DESKTOP_WIDTH,
} from '../../constants/others'
import { Tooltip } from '../../../common/utils/helpers'

const PlayerFooter = ({
  isFirst,
  moveToPrev,
  moveToNext,
  t: i18Translate,
  unansweredQuestionCount,
  isSidebarVisible,
  blockNavigationToAnsweredQuestions,
  firstItemInSectionAndRestrictNav,
  showSubmitText,
}) => (
  <MainFooter
    isSidebarVisible={isSidebarVisible}
    className="practice-player-footer"
  >
    <FlexContainer>
      <Tooltip
        placement="left"
        title={
          blockNavigationToAnsweredQuestions
            ? i18Translate(
                'student:common.layout.questionlist.blockNavigationToAnsweredQuestions'
              )
            : i18Translate('student:common.layout.questionNavigation.previous')
        }
      >
        <span>
          <PrevButton
            data-cy="prev"
            disabled={
              isFirst() ||
              blockNavigationToAnsweredQuestions ||
              firstItemInSectionAndRestrictNav
            }
            onClick={moveToPrev}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </PrevButton>
        </span>
      </Tooltip>
      <Tooltip placement="right" title="Next">
        <NextButton data-cy="next" onClick={moveToNext}>
          <span>
            {showSubmitText
              ? i18Translate('student:common.layout.questionNavigation.submit')
              : i18Translate('student:common.layout.questionNavigation.next')}
          </span>
          <FontAwesomeIcon icon={faAngleRight} />
        </NextButton>
      </Tooltip>
    </FlexContainer>
    <StyledFlexContainer>
      <QuestionsLeftToAttempt data-cy="questionLeftToAttempt" tabIndex="-1">
        <IconCorrect color={themeColor} />
        {unansweredQuestionCount} Left
      </QuestionsLeftToAttempt>
    </StyledFlexContainer>
  </MainFooter>
)

export default PlayerFooter

const MainFooter = styled.div`
  display: flex;
  justify-content: space-between;
  bottom: 0px;
  position: fixed;
  left: ${(props) => (props.isSidebarVisible ? '220px' : '65px')};
  right: 0;
  padding: 22px 35px;
  z-index: 2;
  border-top: 15px solid
    ${(props) => props.theme.widgets.assessmentPlayers.mainBgColor};
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.mainBgColor};
  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
  }
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    left: 0px;
  }
`

const ControlBtn = styled.button`
  width: 187px;
  height: 40px;
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.controlBtnPrimaryColor};
  border: none;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  color: ${(props) =>
    props.theme.widgets.assessmentPlayers.controlBtnTextColor};
  font-size: 2rem;
  padding: 0;
  position: relative;
  display: block;
  text-transform: uppercase;
  &:focus {
    border: none;
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
  &[disabled] {
    background-color: ${(props) => props.theme.btnDisabled};
    cursor: not-allowed;
  }
  .fa {
    position: absolute;
    left: 20px;
    top: 5px;
  }
  span {
    display: block;
    font-size: ${(props) =>
      props.theme.widgets.assessmentPlayerSimple.footerButtonFontSizeLarge};
    @media (max-width: ${IPAD_LANDSCAPE_WIDTH}px) {
      font-size: ${(props) =>
        props.theme.widgets.assessmentPlayerSimple.footerButtonFontSizeSmall};
    }
    @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
      display: none;
    }
  }
`

const PrevButton = styled(ControlBtn)`
  width: 58px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 50px;
  }
`

const NextButton = styled(ControlBtn)`
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-right: 10px;
  }
  svg {
    position: absolute;
    right: 20px;
    top: 5px;
  }
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 50px;
  }
`

const QuestionsLeftToAttempt = styled(ControlBtn)`
  width: 135px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.questionsToAttemptBg};
  color: ${(props) =>
    props.theme.widgets.assessmentPlayers.questionsToAttemptTextColor};
  font-size: ${(props) =>
    props.theme.widgets.assessmentPlayerSimple.footerButtonFontSizeLarge};

  @media (min-width: ${LARGE_DESKTOP_WIDTH}px) {
    width: 187px;
  }

  @media (max-width: ${IPAD_LANDSCAPE_WIDTH}px) {
    font-size: ${(props) =>
      props.theme.widgets.assessmentPlayerSimple.footerButtonFontSizeSmall};
  }
`

const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`
