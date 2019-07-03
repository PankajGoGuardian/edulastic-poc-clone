import React from "react";
import { Switch, message } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";
import { togglePresentationModeAction } from "../../src/actions/testActivity";

const PresentationToggleSwitch = ({ isPresentationMode, togglePresentationMode }) => {
  const toggleCurrentMode = () => {
    togglePresentationMode();
    if (!isPresentationMode)
      message.info("Presentation mode is ON. You can present assessment data without revealing student identity.");
  };

  const title = !isPresentationMode
    ? "Presentation Mode will anonymize the names of students"
    : " Presentation Mode will get OFF";
  return (
    <FeaturesSwitch inputFeatures="presentationMode" actionOnInaccessible="hidden">
      <span>
        {isPresentationMode ? "RESET" : "PRESENT"}{" "}
        <Switch checked={isPresentationMode} title={title} onClick={toggleCurrentMode} />
      </span>
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
