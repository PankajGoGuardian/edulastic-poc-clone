/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { IconLogout, IconGraphRightArrow, IconChevronLeft } from "@edulastic/icons";

import { connect } from "react-redux";
import { FlexContainer, HeaderLeftMenu, MobileMainMenu as Mobile, HeaderMainMenu } from "../common";
import ProgressContainer from "./ProgressContainer";

import {
  HeaderPracticePlayer,
  PlayerTitle,
  ContainerRight,
  FlexDisplay,
  ActionButton
} from "./styled";

import Logo from "../../assets/ets-log.png";
import { finishTestAcitivityAction } from "../../actions/test";

const PlayerHeader = ({
  title,
  previewPlayer,
  dropdownOptions,
  currentItem,
  onNextQuestion,
  unlockNext,
  onPrevQuestion,
  onOpenExitPopup,
  currentTool,
  changeTool,
  submitTest,
  groupId
}) => (
  <Fragment>
    <HeaderPracticePlayer>
      <HeaderLeftMenu skinb="true">
        <img src={Logo} alt="ETS" />
      </HeaderLeftMenu>
      <HeaderMainMenu skinb="true">
        <FlexContainer>
          <PlayerTitle>{title}</PlayerTitle>
          <ProgressContainer questions={dropdownOptions} current={currentItem} desktop="true" />
          <ContainerRight>
            <FlexDisplay>
              {currentItem > 1 && (
                <>
                  {previewPlayer && (
                    <ActionButton onClick={onPrevQuestion} title="Prev">
                      <IconChevronLeft />
                    </ActionButton>
                  )}

                  {currentItem < dropdownOptions.length ? (
                    <ActionButton onClick={onNextQuestion} title="Next" disabled={!unlockNext}>
                      <span>Next</span>
                      <IconGraphRightArrow />
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={() => submitTest(groupId)} title="Submit">
                      <span>Submit</span>
                      <IconGraphRightArrow />
                    </ActionButton>
                  )}
                </>
              )}
              {currentItem <= 1 && (
                <ActionButton onClick={onNextQuestion} title="Start">
                  <span>Start</span>
                  <IconGraphRightArrow />
                </ActionButton>
              )}
              <ActionButton title="Exit" onClick={onOpenExitPopup}>
                <IconLogout />
              </ActionButton>
            </FlexDisplay>
          </ContainerRight>
        </FlexContainer>
        <Mobile>
          <ProgressContainer questions={dropdownOptions} current={currentItem + 1} />
        </Mobile>
      </HeaderMainMenu>
    </HeaderPracticePlayer>
  </Fragment>
);

PlayerHeader.defaultProps = {
  onSaveProgress: () => {}
};

export default connect(
  null,
  {
    submitTest: finishTestAcitivityAction
  }
)(PlayerHeader);
