import React from "react";
import styled from "styled-components";
import { FlexContainer } from "../common";

import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";
import { IconCorrect } from "@edulastic/icons";
import { themeColor, white, largeDesktopWidth } from "@edulastic/colors";
import { showHintButton } from "../../utils/test";

const PlayerFooter = ({
  onCheckAnswer,
  isFirst,
  isLast,
  moveToPrev,
  moveToNext,
  t,
  settings,
  answerChecksUsedForItem,
  unansweredQuestionCount,
  onShowHints,
  showHints,
  questions
}) => {
  return (
    <MainFooter>
      <TopFlexContainer>
        <PrevButton data-cy="prev" disabled={isFirst()} onClick={moveToPrev}>
          <i className="fa fa-angle-left" />
        </PrevButton>
        <ControlBtn data-cy="next" onClick={moveToNext}>
          <i className="fa fa-angle-right" />
          <span>{isLast() ? t("pagination.submit") : t("pagination.next")}</span>
        </ControlBtn>
      </TopFlexContainer>
      <StyledFlexContainer>
        <QuestionsLeftToAttempt data-cy="questionLeftToAttempt">
          <span>
            <IconCorrect color={themeColor} />
            {unansweredQuestionCount} Left
          </span>
        </QuestionsLeftToAttempt>
        {!!showHintButton(questions) && (
          <ActionsButton
            onClick={onShowHints}
            style={
              showHints ? { backgroundColor: themeColor, color: white } : { backgroundColor: white, color: themeColor }
            }
          >
            <span>{t("pagination.hints")}</span>
          </ActionsButton>
        )}
        {!!settings.maxAnswerChecks && (
          <ActionsButton
            onClick={onCheckAnswer}
            title={answerChecksUsedForItem >= settings.maxAnswerChecks ? "Usage limit exceeded" : ""}
          >
            <CounterCircle>{settings.maxAnswerChecks - answerChecksUsedForItem}</CounterCircle>
            <span>{t("pagination.checkanswer")} </span>
          </ActionsButton>
        )}
      </StyledFlexContainer>
    </MainFooter>
  );
};

export default PlayerFooter;

const MainFooter = styled.div`
  background: transparent;
  padding: 50px 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};

  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
  }

  ${({ theme }) => theme.zoomedCss`
    flex-wrap: wrap;
  `}
`;

const CounterCircle = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #fff;
  border-radius: 50%;
  font-size: 12px;
  text-align: center;
  margin: 10px;
  position: absolute;
  left: 0;
  top: 0px;
  padding-top: 2px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    left: 5px;
  }
`;

const ControlBtn = styled.button`
  width: 187px;
  height: 40px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.controlBtnPrimaryColor};
  border: none;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  color: ${props => props.theme.widgets.assessmentPlayers.controlBtnTextColor};
  font-size: 2rem;
  padding: 0;
  position: relative;
  display: block;
  text-transform: uppercase;
  &[disabled] {
    background-color: ${props => props.theme.btnDisabled};
  }
  .fa {
    position: absolute;
    left: 20px;
    top: 5px;
  }
  span {
    font-size: 14px;
    display: block;
    @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
      display: none;
    }
  }
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 50px;
  }
`;

const PrevButton = styled(ControlBtn)`
  width: 50px;
`;

const ActionsButton = styled(ControlBtn)`
  background-color: ${props => props.theme.widgets.assessmentPlayers.controlBtnPrimaryColor};
  border-color: ${props => props.theme.headerIconHoverColor};
  margin-right: 10px;
`;

const QuestionsLeftToAttempt = styled(ControlBtn)`
  span {
    font-size: 14px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  width: 150px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.questionsToAttemptBg};
  color: ${props => props.theme.widgets.assessmentPlayers.questionsToAttemptTextColor};
`;

const TopFlexContainer = styled(FlexContainer)`
  @media (max-width: ${largeDesktopWidth}) {
    margin-bottom: 10px;
  }

  ${({ theme }) => theme.zoomedCss`
    margin-bottom: 10px;
  `}
`;

const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  ${({ theme }) => theme.zoomedCss`
    flex-wrap: wrap;
    justify-content: flex-start;

    & > button {
      margin: 0px 10px 10px 0px;
    }
  `}
`;
