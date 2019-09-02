import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { message } from "antd";

import { fetchAssignmentsAction } from "../TestPage/components/Assign/ducks";
import { setRegradeSettingsDataAction } from "../TestPage/ducks";
import Header from "./Header";
import MainContent from "./MainContent";
import { get } from "lodash";

const RegradeTypes = {
  ALL: "All your assignments",
  THIS_SCHOOL_YEAR: "Your assignments this school year",
  SPECIFIC: "Pick specific assignments to apply to"
};
const RegradeKeys = ["ALL", "THIS_SCHOOL_YEAR", "SPECIFIC"];

const Regrade = ({ assignments, getAssignmentsByTestId, match, setRegradeSettings, districtId }) => {
  const { oldTestId, newTestId } = match.params;

  const settings = {
    newTestId: newTestId,
    oldTestId: oldTestId,
    assignmentList: [],
    districtId,
    applyChangesChoice: RegradeKeys[0],
    options: {
      removedQuestion: "DISCARD",
      addedQuestion: "SKIP",
      correctAnsChanged: "SKIP",
      choicesChanged: "SKIP"
    }
  };
  const [regradeSettings, regradeSettingsChange] = useState(settings);
  const [assignmentOptions, setAssignmentOptions] = useState(RegradeKeys[0]);

  useEffect(() => {
    getAssignmentsByTestId(oldTestId);
  }, []);

  const onUpdateSettings = (key, value) => {
    const newState = {
      ...regradeSettings,
      options: {
        ...regradeSettings.options,
        [key]: value
      }
    };
    regradeSettingsChange(newState);
  };

  const handleSettingsChange = (key, value) => {
    const newState = {
      ...regradeSettings,
      [key]: value
    };
    regradeSettingsChange(newState);
  };

  const onApplySettings = () => {
    if (regradeSettings.applyChangesChoice === "SPECIFIC" && !regradeSettings.assignmentList.length) {
      return message.error("Assignment must contain at least 1 items");
    }
    setRegradeSettings(regradeSettings);
  };
  return (
    <Fragment>
      <Header onApplySettings={onApplySettings} />
      <MainContent
        assignments={assignments}
        RegradeTypes={RegradeTypes}
        RegradeKeys={RegradeKeys}
        onUpdateSettings={onUpdateSettings}
        regradeSettings={regradeSettings}
        handleSettingsChange={handleSettingsChange}
        setAssignmentOptions={setAssignmentOptions}
        assigmentOptions={assignmentOptions}
        regradeSettingsChange={regradeSettingsChange}
      />
    </Fragment>
  );
};

export default connect(
  state => ({
    assignments: state.authorTestAssignments.assignments,
    districtId: get(state, ["user", "user", "orgData", "districtId"])
  }),
  {
    getAssignmentsByTestId: fetchAssignmentsAction,
    setRegradeSettings: setRegradeSettingsDataAction
  }
)(Regrade);
