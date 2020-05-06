import React from "react";
import { Switch, message, Button } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import styled from "styled-components";
import { mobileWidthLarge, themeColor, white } from "@edulastic/colors";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { togglePresentationModeAction } from "../../src/actions/testActivity";

const PresentationToggleSwitch = ({ isPresentationMode, togglePresentationMode, groupId }) => {
  const toggleCurrentMode = () => {
    togglePresentationMode();
    if (!isPresentationMode)
      message.info("Presentation mode is ON. You can present assessment data without revealing student identity.");
  };

  const title = !isPresentationMode
    ? "Presentation Mode will anonymize the names of students"
    : " Presentation Mode will get OFF";
  return (
    <FeaturesSwitch inputFeatures="presentationMode" actionOnInaccessible="hidden" groupId={groupId}>
      <StyledButton title={title} onClick={toggleCurrentMode}>
        {isPresentationMode ? "RESET" : "PRESENT"}{" "}
      </StyledButton>
    </FeaturesSwitch>
  );
};

export default connect(
  state => ({
    isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false)
  }),
  {
    togglePresentationMode: togglePresentationModeAction
  }
)(PresentationToggleSwitch);

const StyledButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: ${themeColor} 0% 0% no-repeat padding-box;
  color: ${white};
  width: 126px;
  height: 28px;
  border-radius: 4px;
  opacity: 1;
  margin-left: 18px;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`;
