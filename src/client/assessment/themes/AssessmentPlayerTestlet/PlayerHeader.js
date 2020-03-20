import { EduButton } from "@edulastic/common";
import { IconGraphRightArrow, IconLogout } from "@edulastic/icons";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Logo from "../../assets/ets-log.png";
import { FlexContainer, HeaderLeftMenu, HeaderMainMenu, MobileMainMenu as Mobile } from "../common";
import ProgressContainer from "./ProgressContainer";
import { ContainerRight, FlexDisplay, HeaderPracticePlayer, PlayerTitle } from "./styled";
import Tools from "./Tools";

const PlayerHeader = ({
  title,
  dropdownOptions,
  currentPage,
  onNextQuestion,
  unlockNext,
  onOpenExitPopup,
  currentTool,
  changeTool,
  calculateMode,
  handleMagnifier,
  enableMagnifier
}) => (
  <Fragment>
    <HeaderPracticePlayer>
      <HeaderLeftMenu skinb="true">
        <img src={Logo} alt="ETS" />
      </HeaderLeftMenu>
      <HeaderMainMenu skinb="true">
        <FlexContainer>
          <PlayerTitle>{title}</PlayerTitle>
          <Tools
            changeTool={changeTool}
            currentTool={currentTool}
            calculateMode={calculateMode}
            handleMagnifier={handleMagnifier}
            enableMagnifier={enableMagnifier}
          />
          <ProgressContainer questions={dropdownOptions} current={currentPage} desktop="true" />
          <ContainerRight>
            <FlexDisplay>
              {currentPage > 1 && (
                <EduButton isGhost height="40px" onClick={onNextQuestion} title="Next" disabled={!unlockNext}>
                  <span>Next</span>
                  <IconGraphRightArrow />
                </EduButton>
              )}
              {currentPage <= 1 && (
                <EduButton isGhost height="40px" onClick={onNextQuestion} title="Start">
                  <span>Start</span>
                  <IconGraphRightArrow />
                </EduButton>
              )}
              <EduButton isGhost IconBtn height="40px" title="Exit" onClick={onOpenExitPopup}>
                <IconLogout />
              </EduButton>
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
  dropdownOptions: PropTypes.array,
  currentPage: PropTypes.number,
  currentTool: PropTypes.number.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  unlockNext: PropTypes.bool,
  onOpenExitPopup: PropTypes.func.isRequired,
  changeTool: PropTypes.func.isRequired,
  calculateMode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired
};

PlayerHeader.defaultProps = {
  unlockNext: false,
  dropdownOptions: [],
  currentPage: 0
};

export default PlayerHeader;
