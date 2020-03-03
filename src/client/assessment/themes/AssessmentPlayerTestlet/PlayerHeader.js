import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { IconLogout, IconGraphRightArrow, IconChevronLeft } from "@edulastic/icons";

import { FlexContainer, HeaderLeftMenu, MobileMainMenu as Mobile, HeaderMainMenu } from "../common";
import ProgressContainer from "./ProgressContainer";

import { HeaderPracticePlayer, PlayerTitle, ContainerRight, FlexDisplay, ActionButton } from "./styled";
import Tools from "./Tools";

import Logo from "../../assets/ets-log.png";

const PlayerHeader = ({
  title,
  previewPlayer,
  dropdownOptions,
  currentPage,
  onNextQuestion,
  unlockNext,
  onPrevQuestion,
  onOpenExitPopup,
  currentTool,
  changeTool,
  calculateMode
}) => (
  <Fragment>
    <HeaderPracticePlayer>
      <HeaderLeftMenu skinb="true">
        <img src={Logo} alt="ETS" />
      </HeaderLeftMenu>
      <HeaderMainMenu skinb="true">
        <FlexContainer>
          <PlayerTitle>{title}</PlayerTitle>
          <Tools changeTool={changeTool} currentTool={currentTool} calculateMode={calculateMode} />
          <ProgressContainer questions={dropdownOptions} current={currentPage} desktop="true" />
          <ContainerRight>
            <FlexDisplay>
              {currentPage > 1 && (
                <>
                  {previewPlayer && (
                    <ActionButton onClick={onPrevQuestion} title="Prev">
                      <IconChevronLeft />
                    </ActionButton>
                  )}
                  <ActionButton onClick={onNextQuestion} title="Next" disabled={!unlockNext}>
                    <span>Next</span>
                    <IconGraphRightArrow />
                  </ActionButton>
                </>
              )}
              {currentPage <= 1 && (
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
          <ProgressContainer questions={dropdownOptions} current={currentPage + 1} />
        </Mobile>
      </HeaderMainMenu>
    </HeaderPracticePlayer>
  </Fragment>
);

PlayerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  previewPlayer: PropTypes.bool,
  dropdownOptions: PropTypes.array,
  currentPage: PropTypes.number,
  currentTool: PropTypes.number.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  unlockNext: PropTypes.bool,
  onPrevQuestion: PropTypes.func.isRequired,
  onOpenExitPopup: PropTypes.func.isRequired,
  changeTool: PropTypes.func.isRequired,
  calculateMode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired
};

PlayerHeader.defaultProps = {
  previewPlayer: false,
  unlockNext: false,
  dropdownOptions: [],
  currentPage: 0
};

export default PlayerHeader;
