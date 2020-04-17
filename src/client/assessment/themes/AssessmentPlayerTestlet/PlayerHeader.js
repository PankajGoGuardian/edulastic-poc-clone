import { IconGraphRightArrow, IconLogout } from "@edulastic/icons";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Logo from "../../assets/ets-log.png";
import { FlexContainer, HeaderLeftMenu, HeaderMainMenu, MobileMainMenu as Mobile } from "../common";
import ProgressContainer from "./ProgressContainer";
import { ContainerRight, FlexDisplay, HeaderPracticePlayer, PlayerTitle, ActionButton } from "./styled";
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
  enableMagnifier,
  hasSubmitButton
}) => {
  let buttonText = "Next";
  let disableButton = !unlockNext && currentPage > 1 && currentPage < dropdownOptions?.length;
  if (currentPage <= 1) {
    buttonText = "Start";
    disableButton = true;
  }
  if (currentPage >= dropdownOptions?.length && hasSubmitButton) {
    buttonText = "Submit";
    disableButton = true;
  }

  const onClickHandle = e => {
    e.target.blur();
    onNextQuestion();
  };

  return (
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
                <ActionButton onClick={onClickHandle} disabled={disableButton}>
                  <span>{buttonText}</span>
                  <IconGraphRightArrow />
                </ActionButton>
                <ActionButton iconBtn title="Exit" onClick={onOpenExitPopup}>
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
};

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
