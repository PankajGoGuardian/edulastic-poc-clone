import React from "react";
import { notification } from "@edulastic/common";
import { connect } from "react-redux";
import { get } from "lodash";
import styled from "styled-components";
import { mobileWidthLarge, themeColor, white } from "@edulastic/colors";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { togglePresentationModeAction } from "../../src/actions/testActivity";

const PresentationToggleSwitch = ({ isPresentationMode, togglePresentationMode, groupId }) => {
  const toggleCurrentMode = () => {
    togglePresentationMode();
    if (!isPresentationMode) notification({ type: "info", messageKey: "presentationMode" });
  };

  const title = !isPresentationMode
    ? "Presentation Mode will anonymize the names of students"
    : " Disable Presentation Mode";
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
