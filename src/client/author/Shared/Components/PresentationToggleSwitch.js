import React from "react";
import { Switch, message } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import styled from "styled-components";
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
      <SwitchBox style={{ fontSize: "10px" }}>
        {isPresentationMode ? "RESET" : "PRESENT"}{" "}
        <Switch checked={isPresentationMode} title={title} onClick={toggleCurrentMode} />
      </SwitchBox>
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

const SwitchBox = styled.span`
  font-size: 10px;
  .ant-switch {
    min-width: 32px;
    height: 16px;
    margin: 0px 0px 0px 5px;
    &:after {
      width: 12px;
      height: 12px;
    }
  }
`;
