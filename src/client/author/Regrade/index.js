import React, { Fragment, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import BreadCrumb from "../src/components/Breadcrumb";
import { fetchAssignmentsAction } from "../TestPage/components/Assign/ducks";
import { setRegradeSettingsDataAction, getRegradingSelector } from "../TestPage/ducks";
import Header from "./Header";
import MainContent from "./MainContent";
import { SecondHeader } from "./styled";

const Regrade = ({ title, getAssignmentsByTestId, match, setRegradeSettings, districtId, history, isRegrading }) => {
  const { oldTestId, newTestId } = match.params;
  const { state: _locationState } = history.location;
  const settings = {
    newTestId: newTestId,
    oldTestId: oldTestId,
    assignmentList: [],
    districtId,
    applyChangesChoice: "ALL",
    options: {
      removedQuestion: "DISCARD",
      addedQuestion: "SKIP",
      testSettings: "EXCLUDE",
      editedQuestion: "SKIP"
    }
  };
  const [regradeSettings, regradeSettingsChange] = useState(settings);

  useEffect(() => {
    getAssignmentsByTestId({ testId: oldTestId, regradeAssignments: true });
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

  const onApplySettings = () => {
    setRegradeSettings(regradeSettings);
  };

  const onCancelRegrade = () => {
    history.push({
      pathname: `/author/tests/tab/review/id/${newTestId}`,
      state: _locationState
    });
  };
  const userFlowUrl = _locationState?.editAssigned
    ? {
        title: "Assignments",
        to: "/author/assignments"
      }
    : {
        title: "Tests",
        to: "/author/tests"
      };

  const breadcrumbData = [userFlowUrl];
  if (!_locationState?.isRedirected) {
    breadcrumbData.push({
      title,
      to: `/author/tests/tab/review/id/${newTestId}`,
      state: _locationState
    });
  }
  breadcrumbData.push({
    title: "Regrade",
    to: ""
  });
  return (
    <Fragment>
      <Header
        onApplySettings={onApplySettings}
        onCancelRegrade={onCancelRegrade}
        title={title}
        isRegrading={isRegrading}
      />
      <SecondHeader>
        <BreadCrumb data={breadcrumbData} style={{ position: "unset" }} />
      </SecondHeader>
      <MainContent regradeSettings={regradeSettings} onUpdateSettings={onUpdateSettings} />
    </Fragment>
  );
};

export default withRouter(
  connect(
    state => ({
      title: get(state, ["authorTestAssignments", "assignments", 0, "title"], ""),
      districtId: get(state, ["user", "user", "orgData", "districtId"]),
      isRegrading: getRegradingSelector(state)
    }),
    {
      getAssignmentsByTestId: fetchAssignmentsAction,
      setRegradeSettings: setRegradeSettingsDataAction
    }
  )(Regrade)
);
