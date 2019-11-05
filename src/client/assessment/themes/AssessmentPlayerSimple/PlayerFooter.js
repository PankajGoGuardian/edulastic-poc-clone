/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { IconCorrect } from "@edulastic/icons";
import { themeColor, largeDesktopWidth } from "@edulastic/colors";
import { FlexContainer } from "../common";

import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";

const PlayerFooter = ({ isFirst, isLast, moveToPrev, moveToNext, t, unansweredQuestionCount }) => (
  <MainFooter>
    <FlexContainer>
      <PrevButton data-cy="prev" disabled={isFirst()} onClick={moveToPrev}>
        <i className="fa fa-angle-left" />
      </PrevButton>
      <NextButton data-cy="next" onClick={moveToNext}>
        <i className="fa fa-angle-right" />
        <span>{isLast() ? t("pagination.submit") : t("pagination.next")}</span>
      </NextButton>
    </FlexContainer>
    <StyledFlexContainer>
      <QuestionsLeftToAttempt data-cy="questionLeftToAttempt">
        <IconCorrect color={themeColor} />
        {unansweredQuestionCount} Left
      </QuestionsLeftToAttempt>
    </StyledFlexContainer>
  </MainFooter>
);

export default PlayerFooter;

const MainFooter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  bottom: 0px;
  padding: 22px 35px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
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
`;

const PrevButton = styled(ControlBtn)`
  width: 58px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 50px;
  }
`;

const NextButton = styled(ControlBtn)`
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 50px;
  }
`;

const QuestionsLeftToAttempt = styled(ControlBtn)`
  font-size: 14px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  span {
  }
  width: 135px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.questionsToAttemptBg};
  color: ${props => props.theme.widgets.assessmentPlayers.questionsToAttemptTextColor};
`;

const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;
